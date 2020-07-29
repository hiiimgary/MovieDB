import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieComponent} from './components/movie/movie.component';
import { SeriesComponent } from './components/series/series.component';
import { PeopleComponent } from './components/people/people.component';

const routes: Routes = [
  {path: 'movies', component: MovieComponent},
  {path: 'series', component: SeriesComponent},
  {path: 'people', component: PeopleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
