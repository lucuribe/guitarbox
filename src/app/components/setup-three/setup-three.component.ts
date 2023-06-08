import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {Instrument} from "../../interfaces/instrument";
import {StorageService} from "../../services/storage.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-setup-three',
  templateUrl: './setup-three.component.html',
  styleUrls: ['./setup-three.component.scss'],
  standalone: true,
  imports: [IonicModule, MatIconModule, FormsModule]
})
export class SetupThreeComponent  implements OnInit {
  instruments: Instrument[] = [
    {id: "guitar", name: "Guitar"},
    {id: "ukulele", name: "Ukulele"}
  ];
  currentInstrument: Instrument = this.instruments[0];

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController) { }

  ngOnInit() {}

  finishSetup() {
    this.storage.set('instrument', this.currentInstrument);
    this.storage.set('setupDone', true);
    this.modalCtrl.dismiss();
  }
}
