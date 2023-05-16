import { Artist } from "./artist";
import { Genre } from "./genre";

export interface Album{
    id: number;
    title: string;
    releaseDate?: Date;
    artist: Artist;
    genre: Genre;
}