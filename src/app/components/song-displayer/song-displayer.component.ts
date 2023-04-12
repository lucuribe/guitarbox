import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-song-displayer',
  templateUrl: './song-displayer.component.html',
  styleUrls: ['./song-displayer.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]

})
export class SongDisplayerComponent  implements OnInit {

  constructor() { }



  song= {
    title: "Space Oddity",
    artist: "David Bowie",
    lyrics: "Intro: {_C} 	{_Em}<br/> {C/}Ground control to Major{Em} Tom<br/> Ground control to Major{Em} Tom<br/> {Am}Take your{Am7} protein pills and {D7} put your helmet on<br><br/>{C}Ground control to Major{Em} Tom<br/>{C}Commencing countdown, engines{Em} on<br>{Am}Check{Am7} ignition and may{D7} Gods love be with you<br/><br/> hola",
    bpm: 115
  }
  
  ngOnInit() {}
}
