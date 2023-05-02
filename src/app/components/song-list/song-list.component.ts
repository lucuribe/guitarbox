import { Component, OnDestroy, OnInit } from '@angular/core';
import { SONGS } from 'src/app/mock-songs';
import { Song } from 'src/app/interfaces/song';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SongDisplayerComponent } from '../song-displayer/song-displayer.component';
@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,SongDisplayerComponent],
})
export class SongListComponent  implements OnInit, OnDestroy {

  songs = SONGS;
  selectedSong?: Song;

  onSelect(song: Song): void {
    this.selectedSong = song;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
      console.log("hola");
  }

  resetSong(){
    this.selectedSong = null!;
  }
}
