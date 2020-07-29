import { Movie } from './movie.model';
import { Series } from './series.model';

export class Person{
    profile_path: string;
    adult: boolean;
    id: number;
    name: string;
    popularity: number;
    known_for_movie: Movie;
    known_for_series: Series;
}

export class PeopleObject{
    people: Person[];
    page: number;
    total_results: number;
    total_pages: number;
}

export class PersonDetails{
    profile_path: string;
    adult: boolean;
    id: number;
    name: string;
    popularity: number;
    birthday: string;
    known_for_department: string;
    deathday: string;
    also_known_as: string;
    gender: number;
    biography: string;
    place_of_birth: string;
}

export class CombinedCredits{
    id: number;
    episode_count: number;
    overview: string;
    name: string;
    media_type: string;
    poster_path: string;
    first_air_date: string;
    vote_average: number;
    character: string;
    popularity: number;
    release_date: string;
    title: string;
}

export class NavigateEvent{ // If user whats to see movies or series related to a person then this class is passed to the corresponding component.
    id: number;
    name: string;
    value: string;
}

