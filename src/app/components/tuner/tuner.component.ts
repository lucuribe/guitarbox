import { CommonModule } from '@angular/common';
import {OnInit, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';

declare const p5: any;
declare const ml5: any;

@Component({
  selector: 'app-tuner-component',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TunerComponent implements OnInit {
  sketch: any;
  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }
}
