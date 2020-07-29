import { Component, OnInit, Input } from '@angular/core';
import { Movie } from 'src/app/models/movie.model';
import { Globals } from '../../globals';
import { Series } from 'src/app/models/series.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  img_url: string = "";
  constructor(private globals: Globals) { }

  @Input() movie: Movie;
  @Input() series: Series;

  

  ngOnInit() {
    // If the Input has image, then the img_url set to the correct path. otherwise placeholder image is set.
    if(this.movie != undefined){
      if(this.movie.poster_path != null){
        this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[2] + this.movie.poster_path;
      } else {
        this.img_url = "../../../assets/placeholder-stayhome.jpg";
      }
    } else if(this.series != undefined){
      if(this.series.poster_path != null){
        this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[2] + this.series.poster_path;
      } else {
        this.img_url = "../../../assets/placeholder-stayhome.jpg";
      }
    }

  }

}
