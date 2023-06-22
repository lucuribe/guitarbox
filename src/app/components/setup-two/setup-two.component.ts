import { Component } from '@angular/core';
import {SetupThreeComponent} from "../setup-three/setup-three.component";
import {IonicModule, IonNav, Platform} from "@ionic/angular";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx"
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-setup-two',
  templateUrl: './setup-two.component.html',
  styleUrls: ['./setup-two.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, TranslateModule]
})
export class SetupTwoComponent {
  component = SetupThreeComponent;
  isAlertOpen = false;
  isToastOpen = false;

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform, private ionNav: IonNav) {
  }

  async requestMicPermission() {
    const check = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    if (!check.hasPermission) {
      const request = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
      if (!request.hasPermission) {
        await this.setAlertOpen(true);
      }
    } else {
      await this.setToastOpen(true);
    }
    await this.ionNav.push(this.component, null,{direction: "forward"});
  }

  setAlertOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
}
