import {Component, ViewChild} from '@angular/core';
import {SetupOneComponent} from "../setup-one/setup-one.component";
import {IonicModule, IonNav, Platform} from "@ionic/angular";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SetupComponent {
  @ViewChild("ionNav", {read: IonNav}) ionNav!: IonNav;

  backButtonSub!: any;
  component = SetupOneComponent;

  constructor(private platform: Platform) {
  }

  ionViewWillEnter() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(101, async () => {
      const canGoBack = await this.ionNav.canGoBack();
      if (canGoBack) {
        await this.ionNav.pop();
      }
    });
  }

  ionViewWillLeave() {
    this.backButtonSub = this.backButtonSub.unsubscribe();
  }
}
