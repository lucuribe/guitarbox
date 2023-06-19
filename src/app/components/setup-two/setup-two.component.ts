import { Component, OnInit } from '@angular/core';
import {SetupThreeComponent} from "../setup-three/setup-three.component";
import {AlertController, IonicModule, IonNav, Platform, ToastController} from "@ionic/angular";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx"
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-setup-two',
  templateUrl: './setup-two.component.html',
  styleUrls: ['./setup-two.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class SetupTwoComponent  implements OnInit {
  component = SetupThreeComponent;

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform, private ionNav: IonNav, private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ngOnInit() {
  }

  async requestMicPermission() {
    const check = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    if (!check.hasPermission) {
      const request = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
      if (!request.hasPermission) {
        await this.presentAlert();
      }
    } else {
      await this.presentToast('bottom');
    }
    await this.ionNav.push(this.component, null,{direction: "forward"});
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Microphone Permission Not Granted',
      message: "It appears you haven't granted microphone permission. The tuner feature requires microphone access. You can manually grant permissions in your device's settings when you're ready.",
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastCtrl.create({
      message: 'Microphone permission already granted!',
      duration: 1000,
      position: position,
    });

    await toast.present();
  }
}
