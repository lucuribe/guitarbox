import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SetupTwoComponent} from "../setup-two/setup-two.component";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-setup-one',
  templateUrl: './setup-one.component.html',
  styleUrls: ['./setup-one.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [IonicModule, TranslateModule]
})
export class SetupOneComponent {
  component = SetupTwoComponent;

  constructor() {
  }
}
