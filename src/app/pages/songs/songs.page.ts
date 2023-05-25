import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Song } from "../../interfaces/song";
import { NavigationExtras, Router } from "@angular/router";
import { SongsService } from 'src/app/services/songs.service';
import { Sheet } from 'src/app/interfaces/sheet';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SongsPage implements OnInit {
  // songs = SONGS;
  selectedSheet?: Sheet;
  sheets: Sheet[] = [];
  filteredSheets: Sheet[] = [];

  constructor(
    private router: Router,
    private songService: SongsService,
    private sheetService: SheetsService) { }

  searchText: string = ''; // Variable para almacenar el texto de búsqueda

  filterList() {
    this.filteredSheets = this.sheets.filter(sheet => {
      // Filtra por song_id.title o artist_id.name
      return (
        sheet.song_id.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        sheet.song_id.album_id.artist_id.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
    // console.log(this.filteredSheets);
  }

  ngOnInit() {
    this.sheetService.getSheets().subscribe(res => {
      console.log(res.sheets); // Verificar si se obtiene un arreglo de canciones
      this.sheets = res.sheets;
      this.filterList();
    });
    
  }

  ngOnDestroy(): void {
    console.log("hola");
  }

  onSelect(sheet: Sheet): void {
    this.selectedSheet = sheet;
  }

  resetSong() {
    this.selectedSheet = null!;
  }

  navigate(sheet: Sheet) {
    const navigationExtras: NavigationExtras = {
      state: { sheet: sheet },
    };

    const urlId = sheet.song_id.album_id + "-" + sheet.song_id.title.replace(" ", "-")
    this.router.navigate(["songs/" + urlId], navigationExtras);
  }

  getSongs() {
  }
}
