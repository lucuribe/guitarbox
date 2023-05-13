import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SONGS} from "../../mock-songs";
import {Song} from "../../interfaces/song";
import {NavigationExtras, Router} from "@angular/router";

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongsPage implements OnInit {
  songs = SONGS;
  selectedSong?: Song;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    console.log("hola");
  }

  onSelect(song: Song): void {
    this.selectedSong = song;
  }

  resetSong(){
    this.selectedSong = null!;
  }

  navigate(song: Song) {
    const navigationExtras: NavigationExtras = {
      state: { song: song },
    };

    const urlId = song.artist + "-" + song.title.replace(" ", "-")
    this.router.navigate(["songs/" + urlId], navigationExtras);
  }
}
