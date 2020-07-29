import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Genre } from 'src/app/models/genre.model';
import { Movie, Movies } from 'src/app/models/movie.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieDialogComponent } from './movie-dialog/movie-dialog.component';
import { KeywordService } from 'src/app/services/keyword.service';
import { Keyword } from 'src/app/models/keyword.model';
import { Observable } from 'rxjs';
import { NavigateEvent } from 'src/app/models/person.model';

// interface for convinient searching by genre
export interface GenreSearch {
  genres: string;
  sortby: string;
}
// interface for convinient searching by similar movies
export interface SimilarSearch {
  id: number;
  title: string;
  query: string;
}

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit, OnChanges {
  //------------------------------------------------------Objects
  movieGenres: Genre[]; //Movie genres for sidepanel
  moviesObject: Movies = new Movies(); 
  //------------------------------------------------------Search Variables
  searchstring: string; //for searching title
  keyword: Keyword;
  genreSearchQuery: GenreSearch = { genres: "", sortby: "" };
  similarTo: SimilarSearch = { id: 0, title: "", query: "" };
  //------------------------------------------------------State Variables
  category: string; // the title on the page
  noResult: boolean = false; // the message on the page if there was no result
  hasMorePage: boolean = true; // if there is no more page then the loading icon is hidden
  lastCall: string = null; // Last call for session storage

 
  //------------------------------------------------------Input event to search for movies by a person
  @Input() personInMovies: NavigateEvent;


  constructor(private movieService: MovieService, private dialog: MatDialog, private keyService: KeywordService) { }

  ngOnInit() {
    //Get moviegenres from service
    this.movieService.getMovieGenres().subscribe(data => {
      this.movieGenres = data;
    });
    let loadpage = null;
    loadpage = localStorage.getItem('last-visit'); //if the last visited category is in the local storage then load it.
    if (loadpage == null) {
      this.getTopRated();                          // otherwise load TopRated Movies
    }
    this.router(loadpage);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}){ // If parent emitted an event then do..
    if(this.personInMovies != undefined){
      this.resetcache();
      this.category = this.personInMovies.name;
      this.searchMovieByPerson();
    }
  }

  onScroll() {                                            //This method is called when scrolled to the bottom of the page
    this.router(this.lastCall);
  }

  router(str: string) {  //This method decides what method to call with an input string. It is needed because of the infinite scrolling
    switch (str) {
      case "toprated":
        this.getTopRated();
        break;
      case "nowplaying":
        this.getNowPlaying();
        break;
      case "popular":
        this.getPopular();
        break;
      case "upcoming":
        this.getUpcoming();
        break;
      case "search":
        this.searchMovie(this.searchstring);
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

  //---------------------------------------------------------------------
  // Gets the MovieDetails and opens up a dialogbox passing the data to
  // it. If the dialogbox closes then examines whether the exit was via
  // button or click out. If the user clicked a button then starts a 
  // new search.
  //---------------------------------------------------------------------

  openDialog(movie: Movie) {
    this.movieService.getMovieById(movie.id).subscribe(moviedetail => {
      const dialogRef = this.dialog.open(MovieDialogComponent, {
        data: moviedetail,
        width: '70%',
        height: '70%',
        position: { left: '20%' },
        panelClass: 'dialog'
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
          this.similarTo.id = movie.id;
          this.similarTo.query = result;
          this.similarTo.title = movie.title;
          this.resetcache();
          this.getSimilarOrRecommended(this.similarTo);
        }

      });
    });
  }

  getTopRated() {
    let res = this.pageChanged(this.lastCall, "toprated");
    this.category = "Top Rated";
    if (res == 3) { return; }
    this.movieService.getCommonMovieRequest(this.moviesObject.page++, 'top_rated').subscribe(data => {
      this.addToList(res, data);
    });
  }

  getPopular() {
    let res = this.pageChanged(this.lastCall, "popular");
    this.category = "Popular";
    if (res == 3) { return; }
    this.movieService.getCommonMovieRequest(this.moviesObject.page++, 'popular').subscribe(data => {
      this.addToList(res, data);
    });
  }

  getNowPlaying() {
    let res = this.pageChanged(this.lastCall, "nowplaying");
    this.category = "Now Playing";
    if (res == 3) { return; }
    this.movieService.getCommonMovieRequest(this.moviesObject.page++, 'now_playing').subscribe(data => {
      this.addToList(res, data);
    });

  }

  getUpcoming() {
    let res = this.pageChanged(this.lastCall, "upcoming");
    this.category = "Upcoming";
    if (res == 3) { return; }
    this.movieService.getCommonMovieRequest(this.moviesObject.page++, 'upcoming').subscribe(data => {
      this.addToList(res, data);
    });

  }
  
  // If we click on Get series with a person on the person dialog box then we search for movies with this person
  searchMovieByPerson(){
    this.lastCall = "searchmoviebyperson";
    this.movieService.getMoviesByPerson(this.personInMovies.id).subscribe(data => {
      this.addToList(2, data);
      this.hasMorePage = false;
    });
  }

  searchMovie(searchstr: string) {
    let res = this.pageChanged(this.lastCall, "search");
    this.category = "Search";
    if (res == 3) { return; }
    this.movieService.searchMovie(encodeURIComponent(searchstr), this.moviesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  searchKeyword(keyword: number) {
    let res = this.pageChanged(this.lastCall, "searchkeyword");
    this.category = "Search";
    if (res == 3) { return; }
    this.movieService.searchMovieByKeyword(keyword, this.moviesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  searchGenres(query: GenreSearch) {
    let res = this.pageChanged(this.lastCall, "searchgenres");
    this.category = "Search";
    if (res == 3) { return; }
    this.movieService.searchMovieByGenres(encodeURIComponent(query.genres), query.sortby, this.moviesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  //the similar and the recommended are 2 separate thing but the api call is almost the same. the similar.query contains a string "similar" or "recommendation"
  getSimilarOrRecommended(similar: SimilarSearch) {
    let res = this.pageChanged(this.lastCall, "searchsimilar");
    this.category = similar.title;
    if (res == 3) { return; }
    this.movieService.getSimilarOrRecommended(similar.id, similar.query, this.moviesObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }

  //------------------------------------------------------------------------------------------
  // The on click methods have to be separated from the actual calls for the infinite scroll.
  // First, we have to search for keywords in the api then we can search for movies by the 
  // keyword ID. 
  //------------------------------------------------------------------------------------------
  searchKeywordOnClick(keywordstr: string) {
    if (keywordstr == "") return;
    this.resetcache();
    this.keyService.searchKeyword(encodeURIComponent(keywordstr)).subscribe(data => { //strings has to be URI encoded.
      let nokeywordfound = true;
      if(data['total_results'] != 0){ // is there are results then we search for the one that we typed in
        (data as any).results.forEach(element => {
          console.log(element);
          if (element.name == keywordstr) {
            nokeywordfound = false;
            this.keyword = element;
            this.searchKeyword(this.keyword.id);
          }
        });
      } 
      if (nokeywordfound) { //if no key found then resets the variables and shows "no result" to the user
        this.resetcache();
        this.noResultsFound();
      }

    });

  }

  //-------------------------------------------------------------------------
  // In the api request, genres has to be comma separated, we have to concatenate
  //-------------------------------------------------------------------------
  searchGenresOnClick(str: string[], sortby: string) {
    if (str.length == 0) return;

    let querystr = str[0];

    if (str.length > 1) {
      for (let i = 1; i < str.length; i++) {
        querystr = querystr + ',' + str[i]; //concat genres in a string
      }

    }
    this.genreSearchQuery.genres = querystr; 
    this.genreSearchQuery.sortby = sortby;
    this.resetcache();                     // reseting the screen
    this.searchGenres(this.genreSearchQuery);

  }

  searchMovieOnClick(searchstr: string) {
    if (searchstr == "") {
      return;
    }
    this.resetcache();
    this.searchstring = searchstr;
    this.searchMovie(this.searchstring);
  }

  //If no results found then hides the loading element and shows the "no result" message
  noResultsFound() {
    this.hasMorePage = false;
    this.noResult = true;
  }

  //saves the last visited common page in the local storage. Next time a user visits the page it will be on the same page
  cacheLastPage(page: string) {
    if (this.lastCall == "toprated" || this.lastCall == "nowplaying" || this.lastCall == "popular" || this.lastCall == "upcoming") {
      localStorage.setItem('last-visit', page);
    }
  }

  //--------------------------------------------------------------------------------
  //this method is in sync with the PageChange() method. That method is call before
  //an api call and this method is called after the api call. This method correspondes
  //to adding the result to the movies object. 
  //--------------------------------------------------------------------------------
  addToList(res: number, data: Movies) {
    if(data.total_results == 0 || data.movies.length == 0){ // if there is no result then show message to the user and return
      this.noResultsFound();
      return;
    }

    if (res == 2) { //if we called a new operation then override the old data with the new
      this.moviesObject = data;
    }
    if (res == 1) { //if we scrolled down and onscroll called then we have to concat the data to our object
      let newData = data.movies;
      this.moviesObject.movies = this.moviesObject.movies.concat(newData);
    }
    if(this.moviesObject.total_pages <= this.moviesObject.page){ // if we reached the total pages then no more data is loaded => we disable the loading icon
      this.moviesObject.page = this.moviesObject.total_pages;
      this.hasMorePage = false;
    } else if(this.moviesObject.page == 1){ // as the api only emitts 20 results and on big screens its not enough, we call for another 20.
      this.router(this.lastCall);
    }
  }

  resetcache() { // resets the last call and page counters
    this.category = "";
    this.lastCall = null;
    this.moviesObject.movies = null;
    this.hasMorePage = true;
    this.noResult = false;
  }

  // -----------------------------------------------------------------------------------------------------------------------------------------------
  // This function corresponds for the content change. If the user switches category, the content should be deleted and the old page should be stored
  // in the sessionStorage to have less api calls. As I implemented infinite scrolling I have to know whether the same function is called as the last
  // one to concatenate the API call result to the objects stored in the component. If the page where the user navigated is in the SessionStorage then
  // we read the data from there to spare the server.
  // -----------------------------------------------------------------------------------------------------------------------------------------------


  pageChanged(oldPage: string, newPage: string) { // (1)= CONCAT | (2)= FROM BEGINING | (3)= SKIP
    this.noResult = false;
    if (oldPage == newPage) { //if we call the same page => concat
      if (this.moviesObject.total_pages <= this.moviesObject.page) { // if the total page is reached => skip
        this.hasMorePage = false;
        return 3;
      }
      return 1;
    }
    if (oldPage == "toprated" || oldPage == "nowplaying" || oldPage == "popular" || oldPage == "upcoming") { //frequently visited pages are stored in session storage
      sessionStorage.setItem(oldPage, JSON.stringify(this.moviesObject));
    }

    if (newPage == "toprated" || newPage == "nowplaying" || newPage == "popular" || newPage == "upcoming") {
      this.moviesObject = JSON.parse(sessionStorage.getItem(newPage));
    } else {
      this.moviesObject = null;
    }

    this.lastCall = newPage;
    this.cacheLastPage(this.lastCall);

    if (this.moviesObject == null) { // if new operation => set default data and return 2 (from beginning)
      this.moviesObject = { movies: [], page: 1, total_pages: 2, total_results: 0 };
      this.hasMorePage = true;
      return 2;
    }

    if (this.moviesObject.total_pages <= this.moviesObject.page) { // if the total number of pages reached then no more page to load
      this.hasMorePage = false;
    } else {
      this.hasMorePage = true;
    }
    return 3;
  }

}
