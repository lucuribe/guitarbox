import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController, IonicModule, Platform, ToastController
} from '@ionic/angular';
import {Bar} from "../../interfaces/bar";
import {arrayFade, fade} from "../../animations";
import {ActivatedRoute, Router} from "@angular/router";
import {KeepAwake} from "@capacitor-community/keep-awake";

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [arrayFade, fade]
})
export class MetronomePage implements OnInit {
  @ViewChild("bpmPicker", {read: ElementRef}) bpmPicker!: ElementRef;

  // SUBSCRIPTIONS
  platformSub: any;

  audioContext: any;
  intervalID: any;
  defaultBars: Bar[] = [
    {id: 0, accent: true, current: false},
    {id: 1, accent: false, current: false},
    {id: 2, accent: false, current: false},
    {id: 3, accent: false, current: false}
  ];
  bars: Bar[] = JSON.parse(JSON.stringify(this.defaultBars));
  taps: number[] = [];
  maxTapInterval: number = 1500; // Maximum time in milliseconds between taps
  panStartX: any;
  panSensitivity: number = 0.25; // Adjust this value to control the sensitivity of the pan gesture, less is slower
  minBpm = 40;
  maxBpm = 220;
  bpm = 120;
  lookahead = 25; // How frequently to call scheduling function (in milliseconds)
  currentQuarterNote = 0;
  scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  nextNoteTime = 0.0; // when the next note is due
  isRunning = false;
  changesBeenMade = false;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private platform: Platform, private activeroute: ActivatedRoute, private router: Router) {
    this.activeroute.queryParams.subscribe(params => {
      const navParams = this.router.getCurrentNavigation();
      if (navParams?.extras.state) {
        this.bpm = navParams.extras.state['bpm'];
      }
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platformSub = this.platform.pause.subscribe(async () => {
      console.log('platform paused')
      if (this.isRunning) {
        this.stop();
      }
    });
  }

  ionViewWillLeave() {
    this.platformSub = this.platformSub.unsubscribe();
  }

  async showBpmInput() {
    const alert = await this.alertCtrl.create({
      header: "Enter BPM",
      cssClass: "custom-alert",
      inputs: [
        {
          cssClass: "custom-alert-input",
          type: 'number',
          name: 'bpm',
          placeholder: 'BPM',
          min: this.minBpm,
          max: this.maxBpm,
          value: this.bpm
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'custom-alert-button',
          role: 'cancel',
        },
        {
          text: 'OK',
          cssClass: 'custom-alert-button',
          handler: data => {
            if (data.bpm && data.bpm >= this.minBpm && data.bpm <= this.maxBpm) {
              this.bpm = data.bpm;
              return true;
            } else {
              this.presentToast('bottom', 'BPM is out of range (' + this.minBpm + '-' + this.maxBpm + ')');
              return false;
            }
          }
        }
      ],
    });

    await alert.present();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  addBar() {
    const barLength = this.bars.length;
    if (barLength <= 12) {
      this.bars.push({id: barLength, accent: false, current: false});
    }
    this.updateChanges();
  }

  removeBar() {
    const barLength = this.bars.length;
    if (barLength > 1) {
      this.bars.pop();
    }
    this.updateChanges();
  }

  resetBars() {
    let barLength = this.bars.length;
    const defaultBarLength = this.defaultBars.length;
    if (barLength > defaultBarLength) {
      this.bars.length = this.defaultBars.length;
    }
    for (let i = 0; i < defaultBarLength; i++) {
      let defaultBar = this.defaultBars[i];
      if (defaultBar) {
        if (JSON.stringify(this.bars[i]) !== JSON.stringify(defaultBar)) {
          if (barLength < defaultBarLength) {
            this.bars[i] = JSON.parse(JSON.stringify(defaultBar));
          } else {
            this.bars[i].accent = defaultBar.accent;
          }
        }
      }
    }
    this.changesBeenMade = false;
  }

  enableDisableAccent($event: any) {
    const barDiv = $event.currentTarget.parentElement;
    for (let bar of this.bars) {
      if (parseInt(barDiv.id) === bar.id) {
        bar.accent = !bar.accent;
      }
    }
    this.updateChanges();
  }

  updateChanges() {
    if (!this.changesBeenMade) {
      this.changesBeenMade = true;
    }
  }

  calculateAverageInterval() {
    const intervals = [];
    for (let i = 1; i < this.taps.length; i++) {
      const interval = this.taps[i] - this.taps[i - 1];
      intervals.push(interval);
    }
    const sum = intervals.reduce((a, b) => a + b, 0);
    return sum / intervals.length;
  }

  tapBpm() {
    const currentTime = Date.now();
    this.taps.push(currentTime);

    // Remove taps that are older than the maximum interval
    const cutoffTime = currentTime - this.maxTapInterval;
    this.taps = this.taps.filter(tapTime => tapTime > cutoffTime);

    if (this.taps.length > 1) {
      const averageInterval = this.calculateAverageInterval();
      const tempo = 60000 / averageInterval; // Convert to beats per minute
      if (tempo >= this.minBpm && tempo <= this.maxBpm ) {
        this.bpm = Math.round(tempo);
      }
    }
  }

  panBpmStart(ev: any) {
    this.panStartX = ev.center.x;
  }

  panBpmEnd() {
    this.panStartX = null;
  }

  panBpm(ev: any) {
    if (this.panStartX !== null) {
      const deltaX = ev.center.x - this.panStartX;
      const increment = Math.round(deltaX * this.panSensitivity);
      const newBpm = this.bpm + increment;
      if (newBpm >= this.minBpm && newBpm <= this.maxBpm ) {
        this.bpm = newBpm;
      }
      this.panStartX = ev.center.x;
    }
  }

  scheduleNote(time: number) {
    // create an oscillator
    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    // set frequency
    osc.frequency.value = 1000;
    for (let bar of this.bars) {
      bar.current = bar.id === this.currentQuarterNote;
      if (bar.current && bar.accent) {
        osc.frequency.value = 1200;
      }
    }

    // set volume
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime);

      // Advance current note and time by a quarter note (crotchet if you're posh)
      this.nextNoteTime += (60.0 / this.bpm); // Add beat length to last beat time

      // Advance the beat number, wrap to zero
      this.currentQuarterNote++;

      // Reset the beat number to 0 after the last bar plays or if the last bar is removed while playing
      let barLength = this.bars.length;
      if (this.currentQuarterNote == barLength || barLength < this.currentQuarterNote) {
        this.currentQuarterNote = 0;
      }
    }
  }

  start() {
    if (this.isRunning) return;
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    this.isRunning = true;
    KeepAwake.keepAwake();
    this.currentQuarterNote = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    for (let bar of this.bars) {
      bar.current = false;
    }
    this.isRunning = false;
    KeepAwake.allowSleep();
    clearInterval(this.intervalID);
  }

  startStop() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }
}
