import {Component, OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class LoadingComponent  implements OnInit {
  constructor() { }

  ngOnInit() {}
}
