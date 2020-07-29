import { Genre } from './genre.model';

export class SeriesDetails{
    poster_path: string;
    popularity: number;
    id: number;
    vote_average: number;
    overview: number;
    first_air_date: string;
    vote_count: number;
    name: string;
    created_by: Creator[];
    genres: Genre[];
    in_production: boolean;
    number_of_episodes: number;
    number_of_seasons: number;
    type: string;
    seasons: Season[];

}

export interface Creator{
    id: number;
    credit_id: string;
    name: string;
    profile_path: string;
}

export interface Season{
    air_date?: string;
    episode_count?: number;
    id?: number;
    name?: string;
    overview?: string;
    poster_path?: string;
    season_number?: number;
    episodes?: Episode[];
}

export interface Episode{
    air_date: string;
    episode_number: number;
    name: string;
    overview: string;
    id: number;
    vote_average: number;
    crew: Crew[];
}

export interface Crew{
    id: number;
    name: string;
    department: string;
    job: string;
    profile_path: string;
}