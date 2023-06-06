import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {StorageService} from "../../services/storage.service";
import {Instrument} from "../../interfaces/instrument";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule]
})
export class MenuPage implements OnInit {
  @ViewChild("instrumentSelect", {read: ElementRef}) instrumentSelect!: ElementRef;

  instruments: Instrument[] = [
    {id: "guitar", name: "Guitar"},
    {id: "ukulele", name: "Ukulele"}
  ];
  currentInstrument!: Instrument;

  constructor(private router: Router, private storage: StorageService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
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
    this.router.navigate([this.router.url]);
  }

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  navToMainView() {
    this.router.navigate(['/']);
  }
}
