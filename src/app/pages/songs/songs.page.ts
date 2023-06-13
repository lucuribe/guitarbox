import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavigationExtras, Router } from "@angular/router";
import { Sheet } from 'src/app/interfaces/sheet';
import { DbService } from 'src/app/services/db.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {LoadingComponent} from "../../components/loading/loading.component";
import {arrayFade, fade} from "../../animations";

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, MatProgressSpinnerModule, LoadingComponent],
  animations: [arrayFade, fade]
})
export class SongsPage implements OnInit {
  sheets: Sheet[] = [];
  filteredSheets: Sheet[] = [];
  isLoading: boolean = true;
  searchText: string = ''; // Variable para almacenar el texto de búsqueda

  constructor(
    private router: Router,
    private dbService: DbService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.dbService.getSheets().subscribe(res => {
      this.sheets = res.sheets;
      this.filterList();
      this.isLoading = false;
    });
  }

  filterList() {
    this.filteredSheets = this.sheets.filter(sheet => {
      // Filtra por song_id.title o artist_id.name
      return (
        sheet.song_id.title.toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
        sheet.song_id.album_id.artist_id.name.toLowerCase().includes(this.searchText.trim().toLowerCase())
      );
    });
  }

  handleRefresh(event: any) {
    this.sheets = [];
    this.filteredSheets = [];
    this.isLoading = true;
    this.dbService.getSheets().subscribe( res => {
      this.isLoading = false;
      this.sheets = res.sheets;
      this.filterList();
      event.target.complete();
    });
  }

  navigate(sheet: Sheet) {
    const navigationExtras: NavigationExtras = {
      state: { sheet: sheet },
    };
    this.router.navigate(["songs/sheet"], navigationExtras);
  }
}
