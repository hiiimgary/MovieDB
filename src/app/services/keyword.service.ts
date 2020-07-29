import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  

  constructor(private http: HttpClient, private globals: Globals) { }

  // gets the keyword id for a string if there is any
  searchKeyword(keyword: string){
    return this.http.get(this.globals.BASE_URL + "/search/keyword" + this.globals.API_KEY + "&query=" + keyword);
  }
}
