export class Series{
    poster_path: string;
    popularity: number;
    id: number;
    vote_average: number;
    overview: number;
    first_air_date: string;
    vote_count: number;
    name: string;
}

export class SeriesObject{
    series?: Series[];
    page?: number;
    total_pages?: number;
    total_results?: number;
}