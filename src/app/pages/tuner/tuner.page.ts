import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TunerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
