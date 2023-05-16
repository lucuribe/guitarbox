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

  scrollSpeed = 50;
  autoScrollActive = false;
  autoScrollInterval: any;
  


  autoScroll(scrollSpeed: number) {
    console.log('Toggle AutoScroll');
    const card = document.querySelector('.card-lyrics') as HTMLElement;
    if (card) {
      console.log('card:', card);
      card.scrollTop = 0;
      const scrollHeight = card.scrollHeight - card.clientHeight;
      const scrollStep = Math.PI / (scrollHeight / 2);
      let count = 0;
      if (this.autoScrollActive) { // si el autoscroll está activo, detenerlo
        clearInterval(this.autoScrollInterval);
        this.autoScrollActive = false;
        console.log('AutoScroll detenido');
      } else { // si el autoscroll no está activo, iniciarlo
        this.autoScrollActive = true;
        console.log('AutoScroll iniciado');
        console.log('autoScrollActive:', this.autoScrollActive);
        this.autoScrollInterval = setInterval(() => {
          if (count < scrollHeight && this.autoScrollActive) {
            card.scrollTop = count;
            count = count + scrollStep * scrollSpeed;
          } else {
            clearInterval(this.autoScrollInterval);
            if (count >= scrollHeight) {
              this.autoScrollActive = false;
              console.log('AutoScroll completado');
            }
          }
        }, 15);
      }
    }
  }


}
