export class Movie{
    poster_path: string;
    overview: string;
    release_date: string;
    genre_ids: number[];
    id: number;
    title: string;
    popularity: number;
    vote_count: number;
    vote_average: number;
}

export class Movies{
    movies?: Movie[];
    page?: number;
    total_pages?: number;
    total_results?: number;
}