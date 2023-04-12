import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SongDisplayerComponent } from 'src/app/components/song-displayer/song-displayer.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,SongDisplayerComponent]
})
export class SongsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
