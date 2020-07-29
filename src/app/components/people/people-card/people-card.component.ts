import { Component, OnInit, Input } from '@angular/core';
import { Globals } from 'src/app/globals';
import { Person, PersonDetails } from 'src/app/models/person.model';

@Component({
  selector: 'app-people-card',
  templateUrl: './people-card.component.html',
  styleUrls: ['./people-card.component.scss']
})
export class PeopleCardComponent implements OnInit {
  
  img_url: string = "";
  constructor(private globals: Globals) { }

  @Input() person: Person;
  

  

  ngOnInit() {
    if(this.person != undefined){
      if(this.person.profile_path != null){
        this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[2] + this.person.profile_path;
      } else {
        this.img_url = "../../../assets/placeholder-stayhome.jpg";
      }
    } 
  }

}
