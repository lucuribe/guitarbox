import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {MatIconModule} from "@angular/material/icon";
import {StorageService} from "../../services/storage.service";
import {Instrument} from "../../interfaces/instrument";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Router} from "@angular/router";
import {LoadingComponent} from "../../components/loading/loading.component";
import {SetupComponent} from "../../components/setup/setup.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, LoadingComponent]
})
export class MenuPage implements OnInit {
  @ViewChild("instrumentSelect", {read: ElementRef}) instrumentSelect!: ElementRef;

  instruments: Instrument[] = [
    {id: "guitar", name: "Guitar"},
    {id: "ukulele", name: "Ukulele"}
  ];
  currentInstrument: Instrument = this.instruments[0];

  isLoading = true;

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.checkSetupDone();
    await this.getCurrentInstrument();
    this.isLoading = false;
  }

  async getCurrentInstrument() {
    const instrument = await this.storage.get('instrument');
    if (instrument) {
      this.currentInstrument = instrument;
    }
  }

  async checkSetupDone() {
    const setupDone = await this.storage.get('setupDone');
    if (!setupDone) {
      await this.openSetupModal();
    }
  }

  changeInstrument(ev: any) {
    this.storage.set('instrument', ev.target.value);
  }

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  navToMainView() {
    this.router.navigate(['/']);
  }

  async openSetupModal() {
    const modal = await this.modalCtrl.create({
      component: SetupComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(data);
    }
  }
}
