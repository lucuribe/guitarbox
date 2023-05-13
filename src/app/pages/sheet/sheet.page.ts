import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Song} from "../../interfaces/song";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.page.html',
  styleUrls: ['./sheet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SheetPage implements OnInit {
  song!: Song;

  constructor(private router: Router, private activeroute: ActivatedRoute) {
    this.activeroute.queryParams.subscribe(params => {
      const navParams = this.router.getCurrentNavigation();
      if(navParams?.extras.state) {
        this.song = navParams.extras.state['song'];
      }
    });
  }

  ngOnInit() {
    this.loadScript('assets/html-chords.js');
    this.getSheet();
  }

  loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
    console.log(script);
  }

  getSheet() {

  }
}
