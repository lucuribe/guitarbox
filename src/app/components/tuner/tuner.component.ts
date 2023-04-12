import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tuner-component',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TunerComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
