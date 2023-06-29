import {Album} from "./album";
import {Genre} from "./genre";
import {Artist} from "./artist";

export interface Song {
  _id: string;
  title: string;
  bpm: number;
  lyrics: string;
  youtubeId: string;
  album: Album;
  artists: Artist[];
  genres: Genre[];
}
