import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {SetupTwoComponent} from "../setup-two/setup-two.component";
import {IonicModule} from "@ionic/angular";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-setup-one',
  templateUrl: './setup-one.component.html',
  styleUrls: ['./setup-one.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, MatIconModule]
})
export class SetupOneComponent  implements OnInit {
  component = SetupTwoComponent;

  constructor() {
  }

  ngOnInit() {
  }
}
