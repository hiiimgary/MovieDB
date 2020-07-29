import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import { Genre } from 'src/app/models/genre.model';
import { SeriesService } from 'src/app/services/series.service';
import { Series, SeriesObject } from 'src/app/models/series.model';
import { GenreSearch, SimilarSearch } from '../movie/movie.component';
import { Keyword } from 'src/app/models/keyword.model';
import { KeywordService } from 'src/app/services/keyword.service';
import { MatDialog } from '@angular/material/dialog';
import { SeriesDialogComponent } from './series-dialog/series-dialog.component';
import { NavigateEvent } from 'src/app/models/person.model';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit, OnChanges {
  // -------------------------------------------------- Objects
  seriesGenres: Genre[];
  tvSeriesObject: SeriesObject;
  // -------------------------------------------------- Search Variables
  category: string = "";
  searchstring: string;
  keyword: Keyword;
  genreSearchQuery: GenreSearch = { genres: "", sortby: "" };
  similarTo: SimilarSearch = { id: 0, title: "", query: "" };
  // -------------------------------------------------- State Variables
  hasMorePage: boolean = true;
  noResult: boolean = false;
  lastCall: string = null; // Last call for session storage

  //input for event from parent
  @Input() personInSeries: NavigateEvent;
  

  constructor(private seriesService: SeriesService, private keyService: KeywordService, private dialog: MatDialog) { }

  // if the last page is in local storage then get it and show that page
  ngOnInit(): void {
    this.seriesService.getSeriesGenres().subscribe(data => {
      this.seriesGenres = data;
    });
    let loadpage = null;
    loadpage = localStorage.getItem('last-tv-visit');
    if (loadpage == null) {
      this.getTopRated();
    }
    this.router(loadpage);
  }

  //if the parent emitts an event then do the operation
  ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    if(this.personInSeries != undefined){
      this.resetcache();
      this.category = this.personInSeries.name;
      this.searchSeriesByPerson();
    }
  }

  // this method is important for the infinite scrolling. We have to know which method to call
  router(str: string) {
    switch (str) {
      case "toprated":
        this.getTopRated();
        break;
      case "ontheair":
        this.getOnTheAir();
        break;
      case "popular":
        this.getPopular();
        break;
      case "airingtoday":
        this.getAiringToday();
        break;
      case "search":
        this.searchTV(this.searchstring);
        break;
      case "searchkeyword":
        this.searchKeyword(this.keyword.id);
        break;
      case "searchgenres":
        this.searchGenres(this.genreSearchQuery);
        break;
      case "searchsimilar":
        this.getSimilarOrRecommended(this.similarTo);
        break;
    }
  }

  //called when we reached the bottom
  onScroll(){
    this.router(this.lastCall);
  }

    //---------------------------------------------------------------------
  // Gets the tvSeriesDetails and opens up a dialogbox passing the data to
  // it. If the dialogbox closes then examines whether the exit was via
  // button or click out. If the user clicked a button then starts a 
  // new search.
  //---------------------------------------------------------------------
  openDialog(series: Series){
    this.seriesService.getSeriesById(series.id).subscribe(seriesdetail => {
      const dialogRef = this.dialog.open(SeriesDialogComponent, {
        data: seriesdetail,
        width: '70%',
        height: '70%',
        position: { left: '20%' },
        panelClass: 'dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
          this.similarTo.id = series.id;
          this.similarTo.query = result;
          this.similarTo.title = series.name;
          this.resetcache();
          this.getSimilarOrRecommended(this.similarTo);
        }

      });
    });
  }

  getTopRated(){
    let res = this.pageChanged(this.lastCall, "toprated");
    this.category = "Top Rated";
    if (res == 3) { return; }
    this.seriesService.getCommonRequest(this.tvSeriesObject.page++, 'top_rated').subscribe(data => {
      this.addToList(res, data);
    });
  }

  getPopular(){
    let res = this.pageChanged(this.lastCall, "popular");
    this.category = "Popular";
    if (res == 3) { return; }
    this.seriesService.getCommonRequest(this.tvSeriesObject.page++, 'popular').subscribe(data => {
      this.addToList(res, data);
    });
  }

  getOnTheAir(){
    let res = this.pageChanged(this.lastCall, "ontheair");
    this.category = "On The Air";
    if (res == 3) { return; }
    this.seriesService.getCommonRequest(this.tvSeriesObject.page++, 'on_the_air').subscribe(data => {
      this.addToList(res, data);
    });
  }

  getAiringToday(){
    let res = this.pageChanged(this.lastCall, "airingtoday");
    this.category = "Airing Today";
    if (res == 3) { return; }
    this.seriesService.getCommonRequest(this.tvSeriesObject.page++, 'airing_today').subscribe(data => {
      this.addToList(res, data);
    });
  }

  
  //-------------------------------------------------------------------------
  // In the api request, genres has to be comma separated, we have to concatenate
  //-------------------------------------------------------------------------
  searchGenresOnClick(str: string[], sortby: string){
    if (str.length == 0) return;

    let querystr = str[0];

    if (str.length > 1) {
      for (let i = 1; i < str.length; i++) {
        querystr = querystr + ',' + str[i];
      }

    }
    this.genreSearchQuery.genres = querystr;
    this.genreSearchQuery.sortby = sortby;
    this.resetcache();
    this.searchGenres(this.genreSearchQuery);
  }

  searchGenres(query: GenreSearch){
    let res = this.pageChanged(this.lastCall, "searchgenres");
    this.category = "Search";
    if (res == 3) { return; }
    this.seriesService.searchSeriesByGenres(encodeURIComponent(query.genres), query.sortby, this.tvSeriesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  searchKeywordOnClick(keywordstr: string){
    if (keywordstr == "") return;
    this.resetcache();
    this.keyService.searchKeyword(encodeURIComponent(keywordstr)).subscribe(data => {
      let nokeywordfound = true;
      if(data['total_results'] != 0){
        data['results'].forEach(element => {
          if (element.name == keywordstr) {
            console.log(element);
            nokeywordfound = false;
            this.keyword = element;
            this.searchKeyword(this.keyword.id);
          }
        });
      }
      if (nokeywordfound) {
        this.resetcache();
        this.noResultsFound();
      }

    });
  }

  searchKeyword(id: number){
    let res = this.pageChanged(this.lastCall, "searchkeyword");
    this.category = "Search";
    if (res == 3) { return; }
    this.seriesService.searchSeriesByKeyword(id+'' , this.tvSeriesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  searchTVOnClick(searchstr: string){
    if (searchstr == "") {
      return;
    }
    this.resetcache();
    this.searchstring = searchstr;
    this.searchTV(this.searchstring);
  }

  searchTV(searchstr: string){
    let res = this.pageChanged(this.lastCall, "search");
    this.category = "Search";
    if (res == 3) { return; }
    this.seriesService.searchSeries(encodeURIComponent(searchstr), this.tvSeriesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  getSimilarOrRecommended(similar: SimilarSearch){
    let res = this.pageChanged(this.lastCall, "searchsimilar");
    this.category = similar.title;
    if (res == 3) { return; }
    this.seriesService.getSimilarOrRecommended(similar.id, similar.query, this.tvSeriesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  // If we click on Get series with a person on the person dialog box then we search for movies with this person
  searchSeriesByPerson(){
    this.lastCall = "searchseriesbyperson";
    this.seriesService.getSeriesByPerson(this.personInSeries.id).subscribe(data => {
      this.addToList(2, data);
      this.hasMorePage = false;
    });
  }

  //--------------------------------------------------------------------------------
  //this method is in sync with the PageChange() method. That method is call before
  //an api call and this method is called after the api call. This method correspondes
  //to adding the result to the movies object. 
  //--------------------------------------------------------------------------------
  addToList(res: number, data: SeriesObject) {
    if(data.total_results == 0 || data.series.length == 0){
      this.noResultsFound();
      return;
    }

    if (res == 2) {
      this.tvSeriesObject = data;
    }
    if (res == 1) {
      let newData = data.series;
      this.tvSeriesObject.series = this.tvSeriesObject.series.concat(newData);
    }
    this.tvSeriesObject.total_pages = data.total_pages;
    if(this.tvSeriesObject.total_pages <= this.tvSeriesObject.page){
      this.tvSeriesObject.page = this.tvSeriesObject.total_pages;
      this.hasMorePage = false;
    } else if(this.tvSeriesObject.page == 1){
      this.router(this.lastCall);
    }
  }

   // -----------------------------------------------------------------------------------------------------------------------------------------------
  // This function corresponds for the content change. If the user switches category, the content should be deleted and the old page should be stored
  // in the sessionStorage to have less api calls. As I implemented infinite scrolling I have to know whether the same function is called as the last
  // one to concatenate the API call result to the objects stored in the component. If the page where the user navigated is in the SessionStorage then
  // we read the data from there to spare the server.
  // -----------------------------------------------------------------------------------------------------------------------------------------------

  pageChanged(oldPage: string, newPage: string) { // (1)= CONCAT | (2)= FROM BEGINING | (3)= SKIP
    this.noResult = false;
    if (oldPage == newPage) {
      if (this.tvSeriesObject.total_pages == this.tvSeriesObject.page) {
        this.hasMorePage = false;
        return 3;
      }
      return 1;
    }
    if (oldPage == "toprated" || oldPage == "airingtoday" || oldPage == "popular" || oldPage == "ontheair") {
      sessionStorage.setItem("tv"+oldPage, JSON.stringify(this.tvSeriesObject));
    }

    if (newPage == "airingtoday" || newPage == "ontheair" || newPage == "popular" || newPage == "toprated") {
      this.tvSeriesObject = JSON.parse(sessionStorage.getItem("tv"+newPage));


    } else {
      this.tvSeriesObject = null;
    }

    this.lastCall = newPage;
    this.cacheLastPage(this.lastCall);

    if (this.tvSeriesObject == null) {
      this.tvSeriesObject = { series: [], page: 1, total_pages: 2, total_results: 0 }
      this.hasMorePage = true;
      return 2;
    }

    if (this.tvSeriesObject.total_pages <= this.tvSeriesObject.page) {
      this.hasMorePage = false;
    } else {
      this.hasMorePage = true;
    }
    return 3;
  }

  //saves the last visited common page in the local storage. Next time a user visits the page it will be on the same page
  cacheLastPage(page: string) {
    if (this.lastCall == "airingtoday" || this.lastCall == "ontheair" || this.lastCall == "popular" || this.lastCall == "toprated") {
      localStorage.setItem('last-tv-visit', page);
    }
  }

  resetcache() { // resets the last call and page counters
    this.category = "";
    this.lastCall = null;
    this.tvSeriesObject.series = null;
    this.hasMorePage = true;
    this.noResult = false;
  }

  //If no results found then hides the loading element and shows the "no result" message
  noResultsFound() {
    this.hasMorePage = false;
    this.noResult = true;
  }

}
