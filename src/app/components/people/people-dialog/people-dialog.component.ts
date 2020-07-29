import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Globals } from 'src/app/globals';
import { PersonDetails } from 'src/app/models/person.model';

@Component({
  selector: 'app-people-dialog',
  templateUrl: './people-dialog.component.html',
  styleUrls: ['./people-dialog.component.scss']
})
export class PeopleDialogComponent implements OnInit {
  also_known_as: string = "";
  person: PersonDetails;
  img_url: string = "";

  constructor(public dialogRef: MatDialogRef<PeopleDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: PersonDetails, private globals: Globals) { }

  ngOnInit() {
    this.person = this.data;
    if (this.person.also_known_as.length > 0) { //concat the alias name for a person into a string
      this.also_known_as = this.person.also_known_as[0];
    }
    if (this.person.also_known_as.length > 1) {
      for (let i = 1; i < this.person.also_known_as.length; i++) {
        this.also_known_as += ', ' + this.person.also_known_as[i];
      }
    }

    if (this.person.profile_path != null) { //gets the profile path
      this.img_url = this.globals.PICTURE_BASE + this.globals.TILE_POSTER_SIZES[4] + this.person.profile_path;
    }



  }

  closeDialog() {
    this.dialogRef.close();
  }

}


