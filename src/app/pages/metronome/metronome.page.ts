import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {Bar} from "../../interfaces/bar";
import {arrayFade, fade} from "../../animations";

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.page.html',
  styleUrls: ['./metronome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule],
  animations: [arrayFade, fade]
})
export class MetronomePage implements OnInit {
  //@ViewChild("barsEl", { read: ElementRef }) barsEl!: ElementRef;

  pickerOptions: {text: string, value: any}[] = [];
  pickerColumns = [{
    name: 'bpmPicker',
    options: this.pickerOptions
  }];
  pickerButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Confirm',
      handler: (value: any) => {
        this.bpm = value.bpmPicker.value;
        this.changesBeenMade = true;
      }
    }
  ];
  audioContext: any;
  intervalID: any;
  defaultBars: Bar[] = [
    {id: 0, accent: true, current: false},
    {id: 1, accent: false, current: false},
    {id: 2, accent: false, current: false},
    {id: 3, accent: false, current: false}
  ];
  bars: Bar[] = JSON.parse(JSON.stringify(this.defaultBars));
  defaultBpm = 120;
  bpm = this.defaultBpm;
  lookahead = 25; // How frequently to call scheduling function (in milliseconds)
  currentQuarterNote = 0;
  scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  nextNoteTime = 0.0; // when the next note is due
  isRunning = false;
  changesBeenMade = false;

  constructor() {
    //initialize bpm picker
    for (let i = 60; i <= 180; i++) {
      this.pickerOptions.push({text: i.toString(), value: i})
    }
  }

  ngOnInit() {
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
    for (let i = 0; i < barLength; i++) {
      let defaultBar = this.defaultBars[i];
      if (defaultBar) {
        if (JSON.stringify(this.bars[i]) !== JSON.stringify(defaultBar)) {
          if (barLength < defaultBarLength) {
            this.bars[i] = JSON.parse(JSON.stringify(defaultBar));
          } else {
            this.bars[i].accent = defaultBar.accent;
          }
        }
      } else {
        this.bars.pop();
      }
    }
    /*while (barLength > defaultBarLength) {
      this.bars.pop();
      barLength = this.bars.length;
    }*/
    this.changesBeenMade = false;
    this.bpm = 120;
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

  hola() {
    console.log("hola");
  }

  scheduleNote(time: number) {
    // create an oscillator
    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

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

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
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
    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext)();
    }
    this.isRunning = true;
    this.currentQuarterNote = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;
    this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
  }

  stop() {
    for (let bar of this.bars) {
      bar.current = false;
    }
    this.isRunning = false;
    clearInterval(this.intervalID);
  }

  startStop()
  {
    if (this.isRunning) {
      this.stop();
    }
    else {
      this.start();
    }
  }
}
