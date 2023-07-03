import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonAccordionGroup, IonicModule, IonModal} from '@ionic/angular';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Chord, SVGuitarChord} from 'svguitar';
import {ChordsService} from "../../services/chords.service";
import {StorageService} from "../../services/storage.service";
import {KeepAwake} from "@capacitor-community/keep-awake";
import {Song} from "../../interfaces/song";
import {TranslateModule} from "@ngx-translate/core";
import {YouTubePlayerModule} from "@angular/youtube-player";
import {Network} from "@capacitor/network";

let apiLoaded = false;
@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.page.html',
  styleUrls: ['./sheet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, YouTubePlayerModule]
})
export class SheetPage implements OnInit {
  @ViewChild('youtubePlayer', {read: ElementRef}) youtubePlayer!: ElementRef;
  @ViewChild('accordionGroup') accordionGroup!: IonAccordionGroup;
  @ViewChild("charts", {read: ElementRef}) charts!: ElementRef;
  @ViewChild("card", {read: ElementRef}) card!: ElementRef;
  @ViewChild(IonModal) modal!: IonModal;

  // SUBSCRIPTIONS
  storageSub: any;

  // VIDEO
  videoWidth = 0;
  videoHeight = 0;
  isVisible = false;
  loading = false;

  song!: Song;
  sheetChords!: string[];
  currentInstrument = "GUITAR";
  chords: Chord[] = [];
  autoScrollSpeed = 6;
  autoScrollActive = false;
  autoScrollInterval: any;
  hasLyrics = false;
  hasVideo = false;
  connected = true;

  constructor(private router: Router, private activeroute: ActivatedRoute, private chordsService: ChordsService, private storage: StorageService) {
    this.activeroute.queryParams.subscribe(params => {
      const navParams = this.router.getCurrentNavigation();
      if (navParams?.extras.state) {
        this.song = navParams.extras.state['song'];
      }
    });
  }

  ngOnInit() {
    this.loadScript('assets/js/html-chords.js');
    this.hasLyrics = this.song.lyrics.trim() != "";
    this.hasVideo = this.song.youtubeId.trim() != "";
    this.sheetChords = this.extraerNotas(this.song.lyrics);
  }

  ionViewWillEnter() {
    console.log(apiLoaded);
    this.getCurrentInstrument();
    if (this.hasLyrics) {
      this.storageSub = this.storage.watchStorage().subscribe(res => {
        if (res.key === "instrument") {
          this.currentInstrument = res.value;
          this.chordsService.loadChords(this.currentInstrument);
        }
      });
    }
    if (this.hasVideo) {
      this.loadYoutubeApi();
      this.getVideoSize();
    }
  }

  async ionViewWillLeave() {
    if (this.storageSub) {
      this.storageSub = this.storageSub.unsubscribe();
    }
    const result = await KeepAwake.isKeptAwake();
    if (result.isKeptAwake) {
      await KeepAwake.allowSleep();
    }
  }

  async getCurrentInstrument() {
    if (this.hasLyrics) {
      this.currentInstrument = await this.storage.get('instrument');
      this.chordsService.loadChords(this.currentInstrument);
    }
  }

  async getNetworkStatus() {
    const status = await Network.getStatus();
    this.connected = status.connected;
  }

  async loadYoutubeApi() {
    await this.getNetworkStatus();
    if (this.connected) {
      this.loading = true;
      if (!apiLoaded) {
        // This code loads the IFrame Player API code asynchronously, according to the instructions at
        // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        apiLoaded = true;
      }
    } else {
      this.loading = false;
    }
  }

  getVideoSize() {
    this.videoWidth = this.youtubePlayer.nativeElement.offsetWidth - 40;
    this.videoHeight = this.videoWidth * 0.6;
  }

  onPlayerReady() {
    this.loading = false;
  }

  toggleAccordion() {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'player') {
      nativeEl.value = undefined;
      this.isVisible = false;
    } else {
      nativeEl.value = 'player';
      this.isVisible = true;
    }
  };

  loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  autoScroll() {
    const card = this.card.nativeElement;
    const scrollSpeed = this.song.bpm/this.autoScrollSpeed;
    if (card) {
      card.scrollTop = 0;
      const scrollHeight = card.scrollHeight - card.clientHeight;
      const scrollStep = (Math.PI / (scrollHeight / 2));
      let count = 0;
      if (this.autoScrollActive) { // si el autoscroll está activo, detenerlo
        this.autoScrollActive = false;
        clearInterval(this.autoScrollInterval);
        KeepAwake.allowSleep();
        console.log('AutoScroll detenido');
      } else { // si el autoscroll no está activo, iniciarlo
        this.autoScrollActive = true;
        KeepAwake.keepAwake();
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
              KeepAwake.allowSleep();
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
      state: { bpm: this.song.bpm },
    };
    this.router.navigate(['metronome'], navigationExtras)
  }

  showCharts() {
    const otherChords = [];
    if (this.autoScrollActive) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollActive = false;
    }
    KeepAwake.isKeptAwake().then((res) => {
      if (res.isKeptAwake) {
        KeepAwake.allowSleep();
      }
    });

    let strings = 6;
    if (this.currentInstrument === 'UKULELE') {
      strings = 4;
    }
    let color = getComputedStyle(document.body).getPropertyValue('--text');
    let textColor = getComputedStyle(document.body).getPropertyValue('--primary-contrast');

    for (const sheetChord of this.sheetChords) {
      const chord = this.chordsService.getChord(sheetChord);
      if (chord) {
        const chartCol = document.createElement('ion-col');
        chartCol.size = 'auto';
        const chartDiv = document.createElement('div');
        chartDiv.style.minWidth = '180px';
        chartDiv.style.fontWeight = '600';
        chartCol.appendChild(chartDiv);
        this.charts.nativeElement.appendChild(chartCol);

        const chart = new SVGuitarChord(chartDiv)
        chart
          .configure({
            strings: strings,
            color: color,
            fingerTextColor: textColor,
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
        if (this.currentInstrument === 'GUITAR') {
          chartImg.src = '../../../assets/images/guitar/' + sheetChord + '.png'
        } else {
          chartImg.src = '../../../assets/images/ukulele/' + sheetChord + '.png'
        }
        chartImg.style.maxWidth = '180px';
        chartDetail.innerHTML = this.reemplazarCadena(sheetChord);
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
