import { Injectable } from '@angular/core';

@Injectable()
export class Globals { // important global variables are stored here.
    readonly BASE_URL: string = "https://api.themoviedb.org/3";
    readonly API_KEY: string = "?api_key=f4983f7578d5d900d8f98dcd1fda686a"
    readonly PICTURE_BASE: string = "https://image.tmdb.org/t/p/";
    TILE_POSTER_SIZES: string[];

}