import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { KeywordService } from './keyword.service';
import { first, catchError, map } from 'rxjs/operators';
import { Identifiers } from '@angular/compiler';
import { forkJoin, Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { Genre } from '../models/genre.model';
import { SeriesObject, Series } from '../models/series.model';
import { Season } from '../models/seriesdetails.model';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private http : HttpClient, private global: Globals, private keyService: KeywordService, private errorHandler: ErrorService) { }

  getSeriesGenres(): Observable<Genre[]>{
    return this.http.get(this.global.BASE_URL + "/genre/tv/list" + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError),
      map(data => data['genres'])
      
    );
  }

  getCommonRequest(page: number, query: string): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/tv/" + query + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['results'];
        seriesobject.page = data['page'];
        seriesobject.total_pages = data['total_pages'];
        seriesobject.total_results = data['total_results'];
        return seriesobject;
      })
    );

  }

  getSeriesById(id: number): Observable<Series>{
    return this.http.get<Series>(this.global.BASE_URL + "/tv/" + id + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  searchSeries(query: string, page: number): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/search/tv" + this.global.API_KEY + "&query=" + query + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['results'];
        seriesobject.page = data['page'];
        seriesobject.total_pages = data['total_pages'];
        seriesobject.total_results = data['total_results'];
        return seriesobject;
      })
    );
  }

  searchSeriesByKeyword(keyword: string, page:number): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/discover/tv" + this.global.API_KEY + "&sort_by=popularity.desc" + "&page=" + page + "&with_keywords=" + keyword).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['results'];
        seriesobject.page = data['page'];
        seriesobject.total_pages = data['total_pages'];
        seriesobject.total_results = data['total_results'];
        return seriesobject;
      })
    );
  }
  
  searchSeriesByGenres(genres: string, sortby: string, page: number): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/discover/tv" + this.global.API_KEY + "&sort_by=" + sortby + "&page=" + page + "&with_genres=" + genres).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['results'];
        seriesobject.page = data['page'];
        seriesobject.total_pages = data['total_pages'];
        seriesobject.total_results = data['total_results'];
        return seriesobject;
      })
    );
  }

  getSimilarOrRecommended(id: number, query: string, page: number): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/tv/" + id + "/" + query + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['results'];
        seriesobject.page = data['page'];
        seriesobject.total_pages = data['total_pages'];
        seriesobject.total_results = data['total_results'];
        return seriesobject;
      })
    );
  }

  getSeriesSeasonDetails(id: number, seasonNumber: number): Promise<Season>{
    return this.http.get(this.global.BASE_URL + "/tv/" + id + "/season/" + seasonNumber + this.global.API_KEY).toPromise().then(data => {return data;})
  }

  getSeriesByPerson(id: number): Observable<SeriesObject>{
    return this.http.get(this.global.BASE_URL + "/person/" + id + "/tv_credits" + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const seriesobject = new SeriesObject;
        seriesobject.series = data['cast'];
        return seriesobject;
      })
    );
  }
}


