import { Component, Output, EventEmitter, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Globals } from 'src/app/globals';
import { MovieDetails } from 'src/app/models/moviedetails.model';

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss']
})
export class MovieDialogComponent {
  movie: MovieDetails;
  img_url: string = "";

  constructor(public dialogRef: MatDialogRef<MovieDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: MovieDetails, private globals: Globals) { }

  ngOnInit(){
    this.movie = this.data;
    if(this.movie.poster_path != null){
      this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[4] + this.movie.poster_path;
    }

  }

  closeDialog(){
    this.dialogRef.close();
  }

}
