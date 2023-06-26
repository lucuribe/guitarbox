import { Component } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-setup-three',
  templateUrl: './setup-three.component.html',
  styleUrls: ['./setup-three.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, TranslateModule, NgIf]
})
export class SetupThreeComponent {
  instruments = ['GUITAR', 'UKULELE'];
  currentInstrument = this.instruments[0];
  isDark = false;

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController) { }

  async ionViewWillEnter() {
    const isDark = await this.storage.get('dark');
    if (isDark) {
      this.isDark = isDark;
    }
  }

  finishSetup() {
    this.storage.set('instrument', this.currentInstrument);
    this.storage.set('setupDone', true);
    this.modalCtrl.dismiss();
  }
}
