import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {StorageService} from "../../services/storage.service";
import {Instrument} from "../../interfaces/instrument";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule]
})
export class MenuPage implements OnInit {
  instruments: Instrument[] = [
    {id: "guitar", name: "Guitar"},
    {id: "ukelele", name: "Ukelele"}
  ];
  currentInstrument!: Instrument;

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.getCurrentInstrument();
  }

  async getCurrentInstrument() {
    const instrument = await this.storage.get('instrument');
    if (instrument) {
      this.currentInstrument = instrument;
    } else {
      this.currentInstrument = this.instruments[0];
      this.storage.set('instrument', this.instruments[0]);
    }
  }

  changeInstrument(ev: any) {
    this.storage.set('instrument', ev.target.value);
  }
}
