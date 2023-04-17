import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Song } from 'src/app/interfaces/song';
import { SongListComponent } from '../song-list/song-list.component';



@Component({
  selector: 'app-song-displayer',
  templateUrl: './song-displayer.component.html',
  styleUrls: ['./song-displayer.component.scss'],

  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SongListComponent]

})
export class SongDisplayerComponent  implements OnInit {


  ngOnInit() {
     this.loadScript('assets/jquery.js');
     this.loadScript('assets/html-chords.js');
     this.loadCSS('assets/html-chords.css');
  }

  constructor() { 
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  loadCSS(url: string) {
    // Create link
    let link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    
    let head = document.getElementsByTagName('head')[0];
    let links = head.getElementsByTagName('link');
    let style = head.getElementsByTagName('style')[0];
    
    // Check if the same style sheet has been loaded already.
    let isLoaded = false;  
    for (var i = 0; i < links.length; i++) {
      var node = links[i];
      if (node.href.indexOf(link.href) > -1) {
        isLoaded = true;
      }
    }
    if (isLoaded) return;
    head.insertBefore(link, style);
  }



  song: Song = {
    id: 1,
    title: "Space Oddity",
    artist: "David Bowie",
    lyrics: "<p>Intro: {   }{_C} 	{_Em}<p/><p>{C}Ground control to Major{Em} Tom<br/> Ground control to Major{_Em} Tom<br/> {Am}Take your{Am7} protein pills and {D7} put your helmet on<br>{C}Ground control to Major{Em} Tom<p/><p>Ejemplo 2{A}{    }{D}</p>",
    bpm: 115,
    id_album: 1,
    duration: 315
  }
  

}
