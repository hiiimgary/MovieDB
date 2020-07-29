import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { KeywordService } from './keyword.service';
import { Keyword } from '../models/keyword.model';
import { ErrorService } from './error.service';
import { map, catchError } from 'rxjs/operators';
import { Genre } from '../models/genre.model';
import { Observable } from 'rxjs';
import { Movie, Movies } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  keywords: Keyword[];

  // calls the configuration API url to set up the picture base url and the image sizes
  constructor(private http: HttpClient, private global: Globals, private keyService: KeywordService, private errorHandler: ErrorService) {
    if (localStorage.getItem('config') == null) {
      this.http.get(this.global.BASE_URL + "/configuration" + this.global.API_KEY).subscribe(data => {
        this.global.TILE_POSTER_SIZES = (data as any).images.poster_sizes;
        localStorage.setItem('config', JSON.stringify(this.global.TILE_POSTER_SIZES))
      });
    } else {
      this.global.TILE_POSTER_SIZES = JSON.parse(localStorage.getItem('config'));
    }
  }
  // returns the movie genres
  getMovieGenres(): Observable<Genre[]> {
    return this.http.get(this.global.BASE_URL + "/genre/movie/list" + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError),
      map(data => data['genres'])
    );
  }
  // common movie requests are the upcoming toprated, popular... these are easy to call on one method.
  getCommonMovieRequest(page: number, query: string): Observable<Movies> {
    return this.http.get(this.global.BASE_URL + "/movie/" + query + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => { //maps the data to the Movies class.
        const movies = new Movies;
        movies.movies = data['results'];
        movies.page = data['page'];
        movies.total_pages = data['total_pages'];
        movies.total_results = data['total_results'];
        return movies;
      })
    );

  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(this.global.BASE_URL + "/movie/" + id + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  searchMovie(query: string, page: number): Observable<Movies> {
    return this.http.get(this.global.BASE_URL + "/search/movie" + this.global.API_KEY + "&query=" + query + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const movies = new Movies;
        movies.movies = data['results'];
        movies.page = data['page'];
        movies.total_pages = data['total_pages'];
        movies.total_results = data['total_results'];
        return movies;
      })
    );
  }

  searchMovieByKeyword(keyword: number, page: number): Observable<Movies> {
    return this.http.get(this.global.BASE_URL + "/keyword/" + keyword + "/movies" + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const movies = new Movies;
        movies.movies = data['results'];
        movies.page = data['page'];
        movies.total_pages = data['total_pages'];
        movies.total_results = data['total_results'];
        return movies;
      })
    );
  }

  searchMovieByGenres(genres: string, sortby: string, page: number): Observable<Movies> {
    return this.http.get(this.global.BASE_URL + "/discover/movie" + this.global.API_KEY + "&sort_by=" + sortby + "&page=" + page + "&with_genres=" + genres).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const movies = new Movies;
        movies.movies = data['results'];
        movies.page = data['page'];
        movies.total_pages = data['total_pages'];
        movies.total_results = data['total_results'];
        return movies;
      })
    );
  }

  getSimilarOrRecommended(id: number, query: string, page: number): Observable<Movies> {
    return this.http.get(this.global.BASE_URL + "/movie/" + id + "/" + query + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const movies = new Movies;
        movies.movies = data['results'];
        movies.page = data['page'];
        movies.total_pages = data['total_pages'];
        movies.total_results = data['total_results'];
        return movies;
      })
    );
  }

  getMoviesByPerson(id: number): Observable<Movies>{
    return this.http.get(this.global.BASE_URL + "/person/" + id + "/movie_credits" + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const movies = new Movies;
        movies.movies = data['cast'];
        return movies;
      })
    );
  }
}
