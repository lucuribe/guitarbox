import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, ModalController} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {Instrument} from "../../interfaces/instrument";
import {Router} from "@angular/router";
import {LoadingComponent} from "../../components/loading/loading.component";
import {SetupComponent} from "../../components/setup/setup.component";
import {Directory, Filesystem} from '@capacitor/filesystem';
import {HttpClient} from "@angular/common/http";
import {FileOpener} from "@capacitor-community/file-opener";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LoadingComponent]
})
export class MenuPage implements OnInit {
  @ViewChild("instrumentSelect", {read: ElementRef}) instrumentSelect!: ElementRef;

  instruments: Instrument[] = [
    {id: "guitar", name: "Guitar"},
    {id: "ukulele", name: "Ukulele"}
  ];
  currentInstrument: Instrument = this.instruments[0];
  userManualUri = '';

  isLoading = true;

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController, private httpClient: HttpClient) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.checkSetupDone();
    await this.getCurrentInstrument();
    await this.getUserManualUri();
    this.isLoading = false;
  }

  async openUserManual() {
    await FileOpener.open({
      filePath: this.userManualUri,
      contentType: 'application/pdf'
    })
  }

  async getCurrentInstrument() {
    const instrument = await this.storage.get('instrument');
    if (instrument) {
      this.currentInstrument = instrument;
    }
  }

  async getUserManualUri() {
    const uri = await this.storage.get('userManualUri');
    if (uri) {
      this.userManualUri = uri;
    } else {
      const url = 'assets/userManual_ES.pdf';
      this.httpClient.get(url, {responseType: 'blob'}).subscribe(async res => {
        const name = url.substring(url.lastIndexOf('/') + 1);
        const base64 = await this.convertBlobToBase64(res) as string;
        const userManual = await Filesystem.writeFile({
          path: name,
          data: base64,
          directory: Directory.Data
        });
        this.userManualUri = userManual.uri;
        this.storage.set('userManualUri', userManual.uri);
      });
    }
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
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
