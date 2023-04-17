import { Component, OnInit } from '@angular/core';
import { SONGS } from 'src/app/mock-songs';
import { Song } from 'src/app/interfaces/song';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,],
})
export class SongListComponent  implements OnInit {

  songs = SONGS;
  selectedSong?: Song;

  onSelect(song: Song): void {
    this.selectedSong = song;
  }

  

  constructor() { }

  ngOnInit() {}

}
