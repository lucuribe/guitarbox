import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule} from '@ionic/angular';
import { TunerComponent } from 'src/app/components/tuner/tuner.component';
import {MatIconModule} from "@angular/material/icon";

declare const p5: any;
declare const ml5: any;

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TunerComponent, MatIconModule]
})
export class TunerPage implements OnInit, AfterViewInit {
  // STATE
  hasStarted = false;
  hasEverStarted = false;
  pitchReachedDelay = false;

  // DISPLAY
  note = '';
  defaultAdvice = 'Tap to unmute your mic';
  advice = this.defaultAdvice;

  // STATS
  detuneDifference = 4;
  tunedQueue = 0;
  elapsedTimeRightPitch: any;

  // P5
  p5: any;
  pitch: any;

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

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.presentAlert();
  }

  startStop() {
    this.hasStarted = !this.hasStarted;
    if (!this.hasEverStarted) {
      this.hasEverStarted = true;
      new p5((tuner: any) => this.handleInput(tuner, this));
    } else {
      this.handleInput(this.p5, this);
    }
  }

  checkTunedQueue() {
    if (!this.elapsedTimeRightPitch) {
      return;
    }
    const endTime = performance.now();
    console.log('hi');
    if (Math.round((endTime - this.elapsedTimeRightPitch) / 1000) > 1 && !this.pitchReachedDelay) {
      this.pitchReachedDelay = true;
      this.advice = 'OK!';
      //this.pitchReached.play();
      setTimeout(() => {
        this.pitchReachedDelay = false;
        this.elapsedTimeRightPitch = null;
        this.advice = this.defaultAdvice;
      }, 1000);
    }
  }

  renderDisplay(tuner: any, toneDiff: number, noteDetected: any) {
    if (tuner.abs(toneDiff) < this.detuneDifference) {
      this.advice = 'Hold there';
      if (this.elapsedTimeRightPitch === null) {
        this.elapsedTimeRightPitch = performance.now();
      }
    } else if (toneDiff > this.detuneDifference) {
      this.advice = 'Tune down';
      this.elapsedTimeRightPitch = null;
    } else if (toneDiff < -this.detuneDifference ) {
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
      const audioContext = new AudioContext();
      const mic = new p5.AudioIn();
      let pitch: any;
      mic.start(loadModel);

      function loadModel() {
        pitch = ml5.pitchDetection(modelUrl, audioContext, mic.stream, modelLoaded);
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
