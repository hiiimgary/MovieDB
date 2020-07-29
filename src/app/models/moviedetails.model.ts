import { Genre } from './genre.model';

export class MovieDetails{
    poster_path: string;
    overview: string;
    release_date: string;
    genres: Genre[];
    id: number;
    title: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
    runtime: number;
}