import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, IonModal} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Sheet} from 'src/app/interfaces/sheet';
import {MatIconModule} from "@angular/material/icon";
import {Chord, SVGuitarChord} from 'svguitar';
import {ChordsService} from "../../services/chords.service";
import {Instrument} from "../../interfaces/instrument";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.page.html',
  styleUrls: ['./sheet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatIconModule]
})
export class SheetPage implements OnInit {
  @ViewChild("charts", {read: ElementRef}) charts!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;

  // SUBSCRIPTIONS
  storageSub: any;

  sheet!: Sheet;
  sheetChords!: string[];
  currentInstrument!: Instrument;
  chords: Chord[] = [];
  scrollSpeed = 50;
  autoScrollActive = false;
  autoScrollInterval: any;
  hasLyrics = false;

  constructor(private router: Router, private activeroute: ActivatedRoute, private chordsService: ChordsService, private storage: StorageService) {
    this.activeroute.queryParams.subscribe(params => {
      const navParams = this.router.getCurrentNavigation();
      if (navParams?.extras.state) {
        this.sheet = navParams.extras.state['sheet'];
      }
    });
  }

  ngOnInit() {
    this.loadScript('assets/html-chords.js');
    this.hasLyrics = this.sheet.lyrics.trim() != "";
    this.sheetChords = this.extraerNotas(this.sheet.lyrics);
  }

  ionViewWillEnter() {
    this.getCurrentInstrument();
    if (this.hasLyrics) {
      this.storageSub = this.storage.watchStorage().subscribe(res => {
        if (res.key === "instrument") {
          this.currentInstrument = res.value;
          this.chordsService.loadChords(this.currentInstrument);
        }
      });
    }
  }

  ionViewWillLeave() {
    if (this.storageSub) {
      this.storageSub = this.storageSub.unsubscribe();
    }
  }

  async getCurrentInstrument() {
    if (this.hasLyrics) {
      this.currentInstrument = await this.storage.get('instrument');
      this.chordsService.loadChords(this.currentInstrument);
    }
  }

  loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

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

  extraerNotas(input: string): string[] {
    const regex = /{([^}]+)}/g;
    const matches = input.match(regex);
    if (!matches) {
      return [];
    }
    const wordsSet = new Set<string>();
    for (const match of matches) {
      const words = match.substring(1, match.length - 1).split(',');
      for (const word of words) {
        const trimmedWord = word.trim();
        const processedWord = trimmedWord.startsWith('_') ? trimmedWord.substring(1) : trimmedWord;
        if (processedWord && !wordsSet.has(processedWord)) {
          wordsSet.add(processedWord);
        }
      }
    }
    return Array.from(wordsSet);
  }

  reemplazarSlashConGuionBajo(title: string) {
    return title.replace(/\//g, "_").replace("#", "Sharp");
  }

  reemplazarCadena(cadena: string): string {
    // Reemplazar "Sharp" por "#"
    let nuevaCadena = cadena.replace(/Sharp/g, '#');

    // Reemplazar "_" por "/"
    nuevaCadena = nuevaCadena.replace(/_/g, '/');

    return nuevaCadena;
  }

  navToMetronomeView() {
    const navigationExtras: NavigationExtras = {
      state: { bpm: this.sheet.song_id.bpm },
    };
    this.router.navigate(['metronome'], navigationExtras)
  }

  showCharts() {
    const otherChords = [];
    for (const sheetChord of this.sheetChords) {
      //for (const sheetChord of this.chordsService.chords) {
      console.log(sheetChord);
      const chord = this.chordsService.getChord(sheetChord);
      if (chord) {
        const chartCol = document.createElement('ion-col');
        chartCol.size = 'auto';
        const chartDiv = document.createElement('div');
        chartDiv.style.minWidth = '180px';
        chartCol.appendChild(chartDiv);
        this.charts.nativeElement.appendChild(chartCol);

        let strings = 6;
        if (this.currentInstrument.id === 'ukulele') {
          strings = 4;
        }

        const chart = new SVGuitarChord(chartDiv)
        chart
          .configure({
            strings: strings,
            frets: 5,
            fretSize: 1,
            fretLabelFontSize: 32,
            fontFamily: 'Inter, sans-serif',
            strokeWidth: 4,
            titleBottomMargin: 60,
            titleFontSize: 32,
          })
          .chord(chord)
          .draw()
      } else {
        otherChords.push(sheetChord);
      }
    }
    if (otherChords.length > 0) {
      for (let sheetChord of otherChords) {
        sheetChord = this.reemplazarSlashConGuionBajo(sheetChord);

        const chartCol = document.createElement('ion-col');
        chartCol.size = 'auto';
        this.charts.nativeElement.appendChild(chartCol);

        const chartContainer = document.createElement('div');
        chartContainer.style.display = 'flex';
        chartContainer.style.flexDirection = 'column';
        chartContainer.style.alignItems = 'center';
        const chartDetail = document.createElement('p');
        chartDetail.style.fontSize = '15px';
        const chartImg = document.createElement('img');
        if (this.currentInstrument.id === 'guitar') {
          chartImg.src = '../../../assets/guitar/' + sheetChord + '.png'
        } else {
          chartImg.src = '../../../assets/ukulele/' + sheetChord + '.png'
        }
        chartImg.style.maxWidth = '180px';
        chartDetail.innerHTML = sheetChord;
        chartContainer.appendChild(chartDetail);
        chartContainer.appendChild(chartImg);
        chartCol.appendChild(chartContainer);
      }
    }
  }

  dismissCharts() {
    this.modal.dismiss(null, 'cancel');
  }
}
