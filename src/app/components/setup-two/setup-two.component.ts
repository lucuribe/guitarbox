import { Component, OnInit } from '@angular/core';
import {SetupThreeComponent} from "../setup-three/setup-three.component";
import {IonicModule, IonNav, Platform} from "@ionic/angular";
import {MatIconModule} from "@angular/material/icon";
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx"
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-setup-two',
  templateUrl: './setup-two.component.html',
  styleUrls: ['./setup-two.component.scss'],
  standalone: true,
  imports: [IonicModule, MatIconModule, NgIf]
})
export class SetupTwoComponent  implements OnInit {
  component = SetupThreeComponent;
  permissionDenied = false;

  constructor(private androidPermissions: AndroidPermissions, private platform: Platform, private ionNav: IonNav) {
    this.platform.ready().then(() => {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
        .then(res => {
          if (res.hasPermission) {
            this.ionNav.push(this.component, null,{direction: "forward"});
          } else {
            this.permissionDenied = true;
          }
        });
    });
  }

  ngOnInit() {
  }
}
