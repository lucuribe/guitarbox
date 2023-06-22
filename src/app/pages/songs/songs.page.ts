import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationExtras, Router } from "@angular/router";
import { DbService } from 'src/app/services/db.service';
import {LoadingComponent} from "../../components/loading/loading.component";
import {fadeIn} from "../../animations";
import {Song} from "../../interfaces/song";
import {StorageService} from "../../services/storage.service";
import { Network } from '@capacitor/network';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LoadingComponent, TranslateModule],
  animations: [fadeIn]
})
export class SongsPage implements OnInit {
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  isLoading = false;
  connected = true;
  networkListener: any;
  searchText = '';

  constructor(private router: Router, private storage: StorageService, private dbService: DbService) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadSongs();
  }

  findSongsByTitle(song: Song) {
    return song.title.toLowerCase().includes(this.searchText.trim().toLowerCase());
  }

  findSongsByArtist(song: Song) {
    for (let artist of song.artists) {
      if (artist.name.includes(this.searchText.trim().toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  filterSongs() {
    this.filteredSongs = this.songs.filter(song => {
      return this.findSongsByTitle(song) || this.findSongsByArtist(song);
    });
  }

  async loadSongs() {
    const status = await Network.getStatus();
    this.connected = status.connected;
    if (this.connected) {
      this.isLoading = true;
      const dbSongs = await this.dbService.getSongs();
      if (dbSongs) {
        this.songs = dbSongs;
        this.storage.set('songs', this.songs);
        console.log("Songs loaded: db", this.songs);
      }
      this.isLoading = false;
    } else {
      if (!this.networkListener) {
        this.networkListener = Network.addListener('networkStatusChange', status => {
          if (status.connected) {
            this.dbService.songsChanged = true;
            this.loadSongs();
            this.networkListener = this.networkListener.remove();
            console.log("Listener removed:", this.networkListener);
          }
        });
        console.log("Listener added:", this.networkListener);
      }
      if (this.songs.length === 0) {
        const localSongs = await this.storage.get('songs');
        if (localSongs) {
          this.songs = localSongs;
        }
      }
      console.log("Songs loaded: local", this.songs);
    }
    this.filterSongs();
  }

  async handleRefresh(event: any) {
    await this.loadSongs();
    event.target.complete();
  }

  navigate(song: Song) {
    const navigationExtras: NavigationExtras = {
      state: { song: song },
    };
    this.router.navigate(["songs/sheet"], navigationExtras);
  }
}
