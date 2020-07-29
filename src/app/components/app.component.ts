import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { SeriesService } from '../services/series.service';
import { Genre } from '../models/genre.model';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NavigateEvent } from '../models/person.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDark: boolean = true;
  title = 'movie-app';
  tabIndex = 0;
  eventToNavMovies: NavigateEvent;
  eventToNavSeries: NavigateEvent;

  constructor(private movieService: MovieService, private overlayContainer: OverlayContainer){}

  ngOnInit(){
    //If there is data in the local storage about the last tab the user was on then that tab is shown
    if(localStorage.getItem('tab-index') != null){
      this.tabIndex = JSON.parse(localStorage.getItem('tab-index'));
    }

    //The theme which was set at last time is configured here.
    if(localStorage.getItem('isDark') != null){
      this.isDark = JSON.parse(localStorage.getItem('isDark'));
    } else {
      localStorage.setItem('isDark', JSON.stringify(this.isDark));
    }
    this.changeDialogTheme();
  }

  // if the People Component emits an event to redirect to another page then this method called.
  // it sets the corresponding event for the Movie or Series component.
  changeTab(event: NavigateEvent){
    if(event.value == "movies"){
      this.tabIndex = 0;
      this.eventToNavMovies = event;
    }
    if(event.value == "series"){
       this.tabIndex = 1;
       this.eventToNavSeries = event;
    }
  }

  // if the tab is changed then we store it in the local storage
  tabChanged(){
    localStorage.setItem('tab-index', this.tabIndex+'');
  }

  // if the user clicks on the icon we switch between 2 themes. light and dark
  setDark(_isdark: boolean){
    _isdark = this.isDark;
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
    this.changeDialogTheme();
  }

  // as dialogs are not onfigured for 2 themes, we set it here.
  changeDialogTheme(){
    if(this.isDark){
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer.getContainerElement().classList.remove('dark-theme');

    }
  }
}
