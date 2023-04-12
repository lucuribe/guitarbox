import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SongDisplayerComponent } from './components/song-displayer/song-displayer.component';


declare function notas1(): void;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule,],
})
export class AppComponent {
  constructor() {
    notas1();
  }
}
