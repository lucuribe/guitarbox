// export interface Song {
//     id: number;
//     title: string;
//     artist: string;
//     id_album: number;
//     lyrics: string;
//     bpm: number;
//     duration: number;
//   }

  import { Album } from "./album";

export interface Song {
    id: number;
    title: string;
    bpm: number;
    // duration: number;
    album_id: string;
    // lyrics: string;
  }