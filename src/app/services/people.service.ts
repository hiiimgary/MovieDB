import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeopleObject, PersonDetails } from '../models/person.model';
import { Globals } from '../globals';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient, private global: Globals, private errorHandler: ErrorService) { }

  //returns popular people
  getPopular(page: number): Observable<PeopleObject> {
    return this.http.get(this.global.BASE_URL + "/person/popular" + this.global.API_KEY + "&page=" + page).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const people = new PeopleObject;
        people.people = data['results'];
        people.page = data['page'];
        people.total_pages = data['total_pages'];
        people.total_results = data['total_results'];
        return people;
      })
    );
  }

  searchPerson(page: number, str: string): Observable<PeopleObject> {
    return this.http.get(this.global.BASE_URL + "/search/person" + this.global.API_KEY + "&page=" + page + "&query=" + str).pipe(
      catchError(this.errorHandler.handleError),
      map(data => {
        const people = new PeopleObject;
        people.people = data['results'];
        people.page = data['page'];
        people.total_pages = data['total_pages'];
        people.total_results = data['total_results'];
        return people;
      })
    );
  }
  // get persondetails for dialog.
  getPersonById(id: number): Observable<PersonDetails>{
    return this.http.get<PersonDetails>(this.global.BASE_URL + "/person/" + id + this.global.API_KEY).pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}
