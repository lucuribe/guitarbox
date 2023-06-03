import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, IonModal} from '@ionic/angular';
import {ActivatedRoute, Router} from "@angular/router";
import {Sheet} from 'src/app/interfaces/sheet';
import {MatIconModule} from "@angular/material/icon";
import {Chord, SVGuitarChord} from 'svguitar';
import {ChordsService} from "../../services/chords.service";

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

  sheet!: Sheet;
  listaChords!: string[][];
  sheetChords!: string[];
  chords: Chord[] = [];

  constructor(private router: Router, private activeroute: ActivatedRoute, private chordsService: ChordsService) {
    this.activeroute.queryParams.subscribe(params => {
      const navParams = this.router.getCurrentNavigation();
      if (navParams?.extras.state) {
        this.sheet = navParams.extras.state['sheet'];
      }
    });
  }

  ngOnInit() {
    this.loadScript('assets/html-chords.js');
    this.listaChords=this.agruparStrings(this.reemplazarSlashConGuionBajo(this.extraerNotas(this.sheet.lyrics)));
    this.sheetChords=this.reemplazarSlashConGuionBajo(this.extraerNotas(this.sheet.lyrics));
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

  reemplazarSlashConGuionBajo(input: string[]): string[] {
    const modifiedStrings: string[] = [];
    for (let str of input) {
      const modifiedStr = str.replace(/\//g, "_").replace("#", "Sharp");

      modifiedStrings.push(modifiedStr);
    }
    return modifiedStrings;
  }

  reemplazarCadena(cadena: string): string {
    // Reemplazar "Sharp" por "#"
    let nuevaCadena = cadena.replace(/Sharp/g, '#');

    // Reemplazar "_" por "/"
    nuevaCadena = nuevaCadena.replace(/_/g, '/');

    return nuevaCadena;
  }

  // verifica si letras existen
  verificadorLetras(letras: string){
    return letras.trim() != "";
  }

  agruparStrings(strings: string[]): string[][] {
    const groupedStrings: string[][] = [];
    let sublist: string[] = [];
    for (let i = 0; i < strings.length; i++) {
      sublist.push(strings[i]);
      if ((i + 1) % 2 === 0 || i === strings.length - 1) {
        groupedStrings.push(sublist);
        sublist = [];
      }
    }
    return groupedStrings;
  }

  showCharts() {
    const otherChords = [];
    for (const sheetChord of this.sheetChords) {
      const chord = this.chordsService.getChord(sheetChord);
      if (chord) {
        const chartCol = document.createElement('ion-col');
        chartCol.size = 'auto';
        const chartDiv = document.createElement('div');
        chartDiv.style.minWidth = '180px';
        chartCol.appendChild(chartDiv);
        this.charts.nativeElement.appendChild(chartCol);

        const chart = new SVGuitarChord(chartDiv)
        chart
          .configure({
            frets: 4,
            fretSize: 1.2,
            fontFamily: 'Inter, sans-serif',
            strokeWidth: 4,
            titleBottomMargin: 60,
            titleFontSize: 32,
          })
          .chord(chord)
          .draw()
      } else {
        otherChords.push(sheetChord);
        console.log(sheetChord);

      }
    }
    if (otherChords.length > 0) {
      for (let sheetChord of otherChords) {
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
        chartImg.src = '../../../assets/guitar/' + sheetChord + '.png'
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
