import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';
import { MovieComponent } from './components/movie/movie.component';
import { SeriesComponent } from './components/series/series.component';
import { PeopleComponent } from './components/people/people.component';
import { Globals } from '../app/globals';
import { CardComponent } from './components/card/card.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MovieDialogComponent } from './components/movie/movie-dialog/movie-dialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SeriesDialogComponent } from './components/series/series-dialog/series-dialog.component';
import { PeopleCardComponent } from './components/people/people-card/people-card.component';
import { PeopleDialogComponent } from './components/people/people-dialog/people-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MovieComponent,
    SeriesComponent,
    PeopleComponent,
    CardComponent,
    MovieDialogComponent,
    SeriesDialogComponent,
    PeopleCardComponent,
    PeopleDialogComponent,
    
    
  ],
  entryComponents: [MovieDialogComponent, PeopleDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
