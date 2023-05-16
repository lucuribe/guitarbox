import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Song } from '../interfaces/song';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  songs: Song[] = [];
  urlBase = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  // getSongs

  getSongs(): Observable<{message: string, songs: Song[] }>{
    return this.httpClient.get<{message: string, songs: Song[] }>(`${this.urlBase}/songs`);
  }
}
