import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule} from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";

declare const p5: any;
declare const ml5: any;

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule]
})
export class TunerPage implements OnInit, AfterViewInit {
  // STATE
  hasStarted = false;
  pitchReachedDelay = false;
  reached = false;
  defaultRotation = 'rotate(0deg)';
  rotation = this.defaultRotation;

  // DISPLAY
  note = '';
  defaultAdvice = 'Tap to unmute your mic';
  advice = this.defaultAdvice;

  // STATS
  detuneDifference = 4;
  elapsedTimeRightPitch: any;

  // P5
  p5: any;
  pitch: any;
  audioCtx: any;

  // NOTES FREQUENCY
  guitarNotes = [
    { note: 'E¹', freq: 82.41 },
    { note: 'A', freq: 110.00 },
    { note: 'D', freq: 146.83 },
    { note: 'G', freq: 196.00 },
    { note: 'B', freq: 246.94 },
    { note: 'E²', freq: 329.63 }
  ];

  // UTIL
  selected = 'guitar';
  selectedToNote = {
    guitar: this.guitarNotes,
    bass: this.guitarNotes
  };

  constructor(private alertCtrl: AlertController) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.presentAlert();
  }

  ionViewDidLeave() {
    if(this.hasStarted){
      this.stopTuner();
    }
  }

  startStop() {
    if (this.hasStarted) {
      this.stopTuner();
    } else {
      this.hasStarted = true;
      this.audioCtx = new AudioContext();
      new p5((tuner: any) => this.handleInput(tuner, this));
    }
  }

  stopTuner() {
    this.audioCtx = this.audioCtx.close();
    this.p5 = this.p5.remove();
    this.hasStarted = false
    this.advice = this.defaultAdvice;
    this.reached = false;
    this.rotation = this.defaultRotation;
    this.note = '';
  }

  checkTunedQueue() {
    if (!this.elapsedTimeRightPitch) {
      return;
    }
    const endTime = performance.now();
    if (Math.round((endTime - this.elapsedTimeRightPitch) / 1000) > 1 && !this.pitchReachedDelay) {
      this.pitchReachedDelay = true;
      //this.pitchReached.play();
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
    } else if (toneDiff < -this.detuneDifference ) {
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
      object.audioCtx = new AudioContext();
      const mic = new p5.AudioIn();
      mic.start(loadModel);
      tuner.noCanvas();

      function loadModel() {
        object.pitch = ml5.pitchDetection(modelUrl, object.audioCtx, mic.stream, modelLoaded);
      }

      function modelLoaded() {
        object.pitch.getPitch(gotPitch);
      }

      function gotPitch(error: string, frequency: number) {
        if (error) {
          console.error(error);
        } else {
          if (frequency) {
            freq = frequency;
          }
          object.pitch.getPitch(gotPitch);
        }
      }
    };

    tuner.draw = () => {
      let noteDetected;
      let toneDiff = Infinity;
      this.selectedToNote.guitar.forEach(note => {
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
    console.log(localStorage.getItem('micPermission'))
    if (localStorage.getItem('micPermission') !== null) {
      return
    }
    const alert = await this.alertCtrl.create({
      header: 'Permission Alert',
      subHeader: '',
      message: 'GuitarBox Tuner needs your audio input to analyze your sound.',
      buttons: [
        {
          text: 'Authorize',
          role: 'confirm',
          handler: () => {
            localStorage.setItem('micPermission', 'true');
          },
        },
      ],
    });

    await alert.present();
  }
}
