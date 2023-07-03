import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, IonToggle, ModalController} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {LoadingComponent} from "../../components/loading/loading.component";
import {SetupComponent} from "../../components/setup/setup.component";
import {Directory, Filesystem} from '@capacitor/filesystem';
import {HttpClient} from "@angular/common/http";
import {FileOpener} from "@capacitor-community/file-opener";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Device} from "@capacitor/device";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LoadingComponent, TranslateModule]
})
export class MenuPage {
  @ViewChild(IonToggle) toggleTheme!: IonToggle;

  instruments = ['GUITAR', 'UKULELE'];
  languages = ['en', 'es'];
  currentInstrument = this.instruments[0];
  currentLanguage = this.languages[0];
  userManualUri = '';
  isDark = false;

  isLoading = true;

  constructor(private router: Router, private storage: StorageService, private modalCtrl: ModalController, private httpClient: HttpClient, private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  async ionViewWillEnter() {
    await this.getCurrentLanguage();
    await this.getCurrentTheme();
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

  async getCurrentLanguage() {
    let language = await this.storage.get('language');
    if (language) {
      this.translate.use(language);
      this.currentLanguage = language;
    } else {
      let deviceLanguage = await Device.getLanguageCode();
      language = this.languages.find(lang => deviceLanguage.value === lang)
      if (language) {
        this.translate.use(language);
        this.currentLanguage = language;
        this.storage.set('language', language);
      }
    }
  }

  async getCurrentTheme() {
    let isDark = await this.storage.get('dark');
    if (isDark || isDark === false) {
      this.isDark = isDark;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDark = prefersDark.matches;
    }
    this.changeTheme();
  }

  async getUserManualUri() {
    const userManual = await this.storage.get('userManual');
    if (userManual && userManual.lang === this.currentLanguage) {
      this.userManualUri = userManual.uri;
    } else {
      const url = 'assets/userManual_' + this.currentLanguage + '.pdf';
      this.httpClient.get(url, {responseType: 'blob'}).subscribe(async res => {
        const name = url.substring(url.lastIndexOf('/') + 1);
        const base64 = await this.convertBlobToBase64(res) as string;
        const userManualFS = await Filesystem.writeFile({
          path: name,
          data: base64,
          directory: Directory.Data
        });
        this.userManualUri = userManualFS.uri;
        this.storage.set('userManual', {"uri": userManualFS.uri, "lang": this.currentLanguage});
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

  changeLanguage(ev: any) {
    this.translate.use(ev.target.value);
    this.storage.set('language', ev.target.value);
    this.currentLanguage = ev.target.value;
    this.getUserManualUri();
  }

  changeTheme(ev?: any) {
    if (ev) {
      this.isDark = ev.detail.checked;
    }
    document.body.classList.toggle('dark', this.isDark);
    this.storage.set('dark', this.isDark);
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
