import { Component } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-setup-three',
  templateUrl: './setup-three.component.html',
  styleUrls: ['./setup-three.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, TranslateModule]
})
export class SetupThreeComponent {
  instruments = ['GUITAR', 'UKULELE'];
  currentInstrument = this.instruments[0];

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController) { }

  finishSetup() {
    this.storage.set('instrument', this.currentInstrument);
    this.storage.set('setupDone', true);
    this.modalCtrl.dismiss();
  }
}
