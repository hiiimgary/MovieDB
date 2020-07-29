import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PeopleObject, Person, NavigateEvent } from 'src/app/models/person.model';
import { PeopleService } from 'src/app/services/people.service';
import { MatDialog } from '@angular/material/dialog';
import { PeopleDialogComponent } from './people-dialog/people-dialog.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  peopleObject: PeopleObject; // the people
  noResult: boolean;  // if there is no result then show message
  hasMorePage: boolean; // if there is no more pages then hide loading icon
  lastCall: string; // we have to know what was the last call in order to use infinite scrolling
  searchstring: string;

  //if we click on the Get related movies/series on a person dialog panel then we give output to parent to call seriescomponent or moviecomponent
  @Output() NavigateToTab = new EventEmitter();


  constructor(private peopleService: PeopleService, private dialog: MatDialog) { }

  ngOnInit(){
    this.peopleObject = { people: [], page: 1, total_pages: 2, total_results: 0 }
    this.getPopular();
  }
  // returns popular movies
  getPopular(){
    let res = this.pageChanged(this.lastCall, "popular");
    if (res == 3) { return; }
    this.peopleService.getPopular(this.peopleObject.page++).subscribe(data => {
      this.addToList(res, data);
    });
  }
  // returns people with name 
  searchPerson(){
    let res = this.pageChanged(this.lastCall, "search");
    if (res == 3) { return; }
    this.peopleService.searchPerson(this.peopleObject.page++, encodeURIComponent(this.searchstring)).subscribe(data => {
      this.addToList(res, data);
    });
  }

  searchPersonOnClick(str: string){
    if (str == "") {
      return;
    }
    this.resetcache();
    this.searchstring = str;
    this.searchPerson();
  }
  //---------------------------------------------------------------------
  // Gets the PersonDetails and opens up a dialogbox passing the data to
  // it. If the dialogbox closes then examines whether the exit was via
  // button or click out. If the user clicked a button then starts a 
  // new search.
  //---------------------------------------------------------------------
  openDialog(person: Person) {
    this.peopleService.getPersonById(person.id).subscribe(persondetail => {
      const dialogRef = this.dialog.open(PeopleDialogComponent, {
        data: persondetail,
        width: '70%',
        height: '70%',
        position: { left: '20%' },
        panelClass: 'dialog'
      });
      dialogRef.afterClosed().subscribe(result => { 
        if(result != undefined){ // if we clicked on the button
          let event:NavigateEvent = { id: person.id, name: person.name, value: result }; // create navigateEvent
          this.NavigateToTab.emit(event); //output event for parent
        }

      });
    });
  }

  //--------------------------------------------------------------------------------
  //this method is in sync with the PageChange() method. That method is call before
  //an api call and this method is called after the api call. This method correspondes
  //to adding the result to the movies object. 
  //--------------------------------------------------------------------------------
  addToList(res: number, data: PeopleObject) {
    if(data.total_results == 0 || data.people.length == 0){
      this.noResultsFound();
      return;
    }

    if (res == 2) {
      this.peopleObject = data;
    }
    if (res == 1) {
      let newData = data.people;
      this.peopleObject.people = this.peopleObject.people.concat(newData);
    }
    if(this.peopleObject.total_pages <= this.peopleObject.page){
      this.peopleObject.page = this.peopleObject.total_pages;
      this.hasMorePage = false;
    } else if(this.peopleObject.page == 1){
      this.router(this.lastCall);
    }
  }

  resetcache() { // resets the last call and page counters
    this.lastCall = null;
    this.peopleObject.people = null;
    this.hasMorePage = true;
    this.noResult = false;
  }

  noResultsFound() {
    this.hasMorePage = false;
    this.noResult = true;
  }

  onScroll(){
    this.router(this.lastCall);
  }

  // for infinite scrolling
  router(str: string){
    switch(str){
      case 'popular':
        this.getPopular();
        break;
      case 'search':
        this.searchPerson(); 
    }
  }
  // --------------------------------------------------------------------------------------------------------------
  // This function corresponds for the content change. If the user switches category, the content should be deleted
  // As I implemented infinite scrolling I have to know whether the same function is called as the last
  // one to concatenate the API call result to the objects stored in the component.
  // ------------------------------------------------------------------------------------------------------------
  pageChanged(oldPage: string, newPage: string) { // (1)= CONCAT | (2)= FROM BEGINING | (3)= SKIP
    this.noResult = false;
    if (oldPage == newPage) {
      if (this.peopleObject.total_pages <= this.peopleObject.page) {
        this.hasMorePage = false;
        return 3;
      }
      return 1;
    }
    this.lastCall = newPage;
    
    this.peopleObject = { people: [], page: 1, total_pages: 2, total_results: 0 };
    this.hasMorePage = true;
    return 2;
  }

}
