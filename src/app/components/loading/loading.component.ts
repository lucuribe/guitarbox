import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class LoadingComponent  implements OnInit {
  constructor() { }

  ngOnInit() {}
}
