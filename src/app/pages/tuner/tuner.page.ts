import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertController, IonicModule, Platform} from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {Instrument} from "../../interfaces/instrument";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx";
import {KeepAwake} from "@capacitor-community/keep-awake";

declare const p5: any;
declare const ml5: any;

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule]
})
export class TunerPage implements OnInit {
  // SUBSCRIPTIONS
  storageSub: any;
  platformPauseSub: any;
  platformResumeSub: any;

  // STATE
  hasStarted = false;
  pitchReachedDelay = false;
  reached = false;
  defaultRotation = 'rotate(0deg)';
  rotation = this.defaultRotation;
  hasPermission = true;

  // DISPLAY
  note = '';
  defaultAdvice = 'Tap to unmute your mic';
  advice = this.defaultAdvice;

  // STATS
  detuneDifference = 1;
  elapsedTimeRightPitch: any;

  // P5
  p5: any;
  audioCtx: any;

  // NOTES FREQUENCIES
  guitarNotes = [
    {note: 'E¹', freq: 82.41},
    {note: 'A', freq: 110.00},
    {note: 'D', freq: 146.83},
    {note: 'G', freq: 196.00},
    {note: 'B', freq: 246.94},
    {note: 'E²', freq: 329.63}
  ];
  ukuleleNotes = [
    {note: "A", freq: 440},
    {note: "E", freq: 329.63},
    {note: "C", freq: 261.63},
    {note: "G", freq: 392}
  ];

  // UTIL
  pitchReached = new Audio('../../assets/audio/pitch-reached.mp3');
  selected!: Instrument;
  selectedNotes: { note: string, freq: number }[] = [];

  constructor(private storage: StorageService, private router: Router, private platform: Platform, private androidPermissions: AndroidPermissions, private alertCtrl: AlertController) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter TUNER');
    this.checkMicPermission();
    this.platformPauseSub = this.platform.pause.subscribe( () => {
      if (this.hasStarted) {
        this.stopTuner();
      }
    });
    this.platformResumeSub = this.platform.resume.subscribe( async () => {
      await this.checkMicPermission();
    });
    this.storageSub = this.storage.watchStorage().subscribe(res => {
      if (res.key === "instrument") {
        if (this.hasStarted) {
          this.stopTuner();
        }
      }
    });
  }

  ionViewWillLeave() {
    if (this.hasStarted) {
      this.stopTuner();
    }
    this.storageSub = this.storageSub.unsubscribe();
    this.platformResumeSub = this.platformResumeSub.unsubscribe();
    this.platformPauseSub = this.platformPauseSub.unsubscribe();
  }

  async startStop() {
    if (this.hasStarted) {
      this.stopTuner();
    } else {
      if (this.hasPermission) {
        this.hasStarted = true;
        this.audioCtx = new AudioContext();
        this.selected = await this.storage.get('instrument');
        if (this.selected.id === "guitar") {
          this.selectedNotes = this.guitarNotes;
        } else if (this.selected.id === "ukulele") {
          this.selectedNotes = this.ukuleleNotes;
        }
        await KeepAwake.keepAwake();
        new p5((tuner: any) => this.handleInput(tuner, this));
      } else {
        await this.presentAlert();
      }
    }
  }

  stopTuner() {
    this.audioCtx.close()
      .then((res: any) => {
        this.audioCtx = res
      })
    this.p5 = this.p5.remove();
    this.hasStarted = false
    this.advice = this.defaultAdvice;
    this.reached = false;
    this.rotation = this.defaultRotation;
    this.note = '';
    KeepAwake.allowSleep();
  }

  async checkMicPermission() {
    const check = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    this.hasPermission = check.hasPermission;
  }

  checkTunedQueue() {
    if (!this.elapsedTimeRightPitch) {
      return;
    }
    const endTime = performance.now();
    if (Math.round((endTime - this.elapsedTimeRightPitch) / 1000) > 1 && !this.pitchReachedDelay) {
      this.pitchReachedDelay = true;
      this.pitchReached.play();
      setTimeout(() => {
        this.pitchReachedDelay = false;
        this.elapsedTimeRightPitch = null;
      }, 1000);
    }
  }

  renderDisplay(tuner: any, toneDiff: number, noteDetected: any) {
    this.reached = false;
    if (tuner.abs(toneDiff) < this.detuneDifference) {
      this.rotation = 'rotate(90deg)';
      this.advice = 'Hold there';
      this.reached = true;
      if (this.elapsedTimeRightPitch === null) {
        this.elapsedTimeRightPitch = performance.now();
      }
    } else if (toneDiff > this.detuneDifference) {
      this.rotation = 'rotate(180deg)';
      this.advice = 'Tune down';
      this.elapsedTimeRightPitch = null;
    } else if (toneDiff < -this.detuneDifference) {
      this.rotation = 'rotate(0deg)';
      this.advice = 'Tune up';
      this.elapsedTimeRightPitch = null;
    }
    this.note = noteDetected.note;
    this.checkTunedQueue();
  }

  handleInput(tuner: any, object: any) {
    let freq = 0;

    object.p5 = tuner;

    tuner.setup = () => {
      const modelUrl = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
      const mic = new p5.AudioIn();
      mic.start(loadModel);
      let pitch: any;
      tuner.noCanvas();

      function loadModel() {
        pitch = ml5.pitchDetection(modelUrl, object.audioCtx, mic.stream, modelLoaded);
      }

      function modelLoaded() {
        pitch.getPitch(gotPitch);
      }

      function gotPitch(error: string, frequency: number) {
        if (error) {
          console.error(error);
        } else {
          if (frequency) {
            freq = frequency;
          }
          pitch.getPitch(gotPitch);
        }
      }
    };

    tuner.draw = () => {
      let noteDetected;
      let toneDiff = Infinity;
      this.selectedNotes.forEach(note => {
        const diff = freq - note.freq;
        if (tuner.abs(diff) < tuner.abs(toneDiff)) {
          noteDetected = note;
          toneDiff = diff;
        }
      });
      object.renderDisplay(tuner, toneDiff, noteDetected);
    };
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Microphone Permission Not Granted',
      message: "It appears you haven't granted microphone permission. The tuner feature requires microphone access. You can manually grant permissions in your device's settings.",
      buttons: ['OK'],
    });

    await alert.present();
  }
}
