import { Instrument } from "./instrument";
import { Song } from "./song";

export interface Sheet{
    id: number;
    lyrics: string;
    instrument: Instrument;
    song: Song;
}