import { Artist } from "./artist";
import { Genre } from "./genre";

export interface Album{
    id: number;
    title: string;
    releaseDate?: Date;
    artist_id: Artist;
    genre_id: Genre;
}