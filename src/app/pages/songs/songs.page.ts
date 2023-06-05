import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationExtras, Router } from "@angular/router";
import { Sheet } from 'src/app/interfaces/sheet';
import { DbService } from 'src/app/services/db.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatProgressSpinnerModule]
})
export class SongsPage implements OnInit {
  sheets: Sheet[] = [];
  filteredSheets: Sheet[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private dbService: DbService) { }

  searchText: string = ''; // Variable para almacenar el texto de búsqueda

  filterList() {
    this.filteredSheets = this.sheets.filter(sheet => {
      // Filtra por song_id.title o artist_id.name
      return (
        sheet.song_id.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        sheet.song_id.album_id.artist_id.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }

  ngOnInit() {
    this.dbService.getSheets().subscribe(res => {
      this.sheets = res.sheets;
      this.filterList();
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    console.log("destroy");
  }

  navigate(sheet: Sheet) {
    const navigationExtras: NavigationExtras = {
      state: { sheet: sheet },
    };
    this.router.navigate(["songs/sheet"], navigationExtras);
  }
}
