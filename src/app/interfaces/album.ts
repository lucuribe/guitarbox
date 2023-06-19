import { Artist } from "./artist";
import { Genre } from "./genre";
import {Song} from "./song";

export interface Album {
  _id: string;
  title: string;
  releaseDate?: Date;
  songs: Song[];
  artists: Artist[];
  genres: Genre[];
}
