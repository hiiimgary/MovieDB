import { Component, OnInit, Inject } from '@angular/core';
import { MovieDialogComponent } from '../../movie/movie-dialog/movie-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Globals } from 'src/app/globals';
import { SeriesDetails, Season } from '../../../models/seriesdetails.model';
import { SeriesService } from 'src/app/services/series.service';
import { Observable } from 'rxjs/internal/Observable';



@Component({
  selector: 'app-series-dialog',
  templateUrl: './series-dialog.component.html',
  styleUrls: ['./series-dialog.component.scss']
})
export class SeriesDialogComponent implements OnInit {

  series: SeriesDetails;
  img_url: string = "";
  seasons: Season[];

  constructor(public dialogRef: MatDialogRef<MovieDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: SeriesDetails, private globals: Globals, private seriesService: SeriesService) { }

  ngOnInit(){
    this.series = this.data;
    this.seasons = [];
    if(this.series.poster_path != null){ // sets image url
      this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[4] + this.series.poster_path;
    }

    this.getSeasons();
    
  }

  //-----------------------------------------------------------------------------
  // Gets the seasons for the series. As it can be a lot of data, we dont flood the
  // network. The method waits for one response and after that it calls it again 
  // for the next season.
  //-----------------------------------------------------------------------------
  async getSeasons() {
    let i: number = 1;

    while(i <= this.series.number_of_seasons){
      this.seasons[i-1] = await this.seriesService.getSeriesSeasonDetails(this.series.id, i);
      console.log(this.seasons[i-1]);
      i++;
    }

    
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
