import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Chord} from "svguitar";

@Injectable({
  providedIn: 'root'
})
export class ChordsService {
  chords: Chord[] = [];
  urlBase = 'assets/chords';
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<{chords: Chord[]}>(this.urlBase + '/guitar.json').subscribe((res) => {
      this.chords = res['chords'];
    });
  }

  getChord(chordName: string): any {
    for (let chord of this.chords) {
      let name = chord.title?.trim().replace("Major", "").replace("Minor", "m").replace(" ", "");

      if (name?.toLowerCase() === chordName.toLowerCase()) {
        return chord;
      }
    }
    return;
  }
}
