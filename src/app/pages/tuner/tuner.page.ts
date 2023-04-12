import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TunerComponent } from 'src/app/components/tuner/tuner.component';
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.page.html',
  styleUrls: ['./tuner.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TunerComponent, MatIconModule]
})
export class TunerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
