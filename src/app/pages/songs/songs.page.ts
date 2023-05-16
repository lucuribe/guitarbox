import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import {SONGS} from "../../mock-songs";
import {Song} from "../../interfaces/song";
import {NavigationExtras, Router} from "@angular/router";
import { SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongsPage implements OnInit {
  // songs = SONGS;
  selectedSong?: Song;
  songs: Song[]=[];

  constructor(private router: Router, private songService: SongsService) {
    
   }
   

  ngOnInit() {
    this.songService.getSongs().subscribe(res => {
      console.log(res.songs); // Verificar si se obtiene un arreglo de canciones
      this.songs = res.songs;
    });
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

    const urlId = song.album_id + "-" + song.title.replace(" ", "-")
    this.router.navigate(["songs/" + urlId], navigationExtras);
  }

  getSongs() {
  }
}
