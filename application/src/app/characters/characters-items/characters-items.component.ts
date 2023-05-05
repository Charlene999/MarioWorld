import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Item, character, AllClasses, IdToImage } from '../../schemaHelper';
import { addItemtoCharacter, getCharacterItems, getUserCharacters, removeItemfromCharacter } from './characters-items-helper';
@Component({
  selector: 'app-characters-items',
  templateUrl: './characters-items.component.html',
  styleUrls: ['./characters-items.component.css']
})
export class CharactersItemsComponent {

  allChars: character[];
  curChar: character;
  allItems: Item[];
  viewSubmitted: Boolean;
  addSubmitted: Boolean;
  removeSubmitted: Boolean;
  searchText: any;

  constructor(private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Character Items");
    this.allChars = [];
    this.allItems = [];
    this.curChar = {} as character;
    this.viewSubmitted = false;
    this.addSubmitted = false;
    this.removeSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null)
      this.router.navigateByUrl('/');

    this.showCharacters();
  }

  // Update current Characters
  showCharacters() {
    getUserCharacters(this.http, this.allChars);
  }

  // show all items owned and unowned for that class and level
  showItems() {
    this.viewSubmitted = true;
    getCharacterItems(this.http, this.allChars, this.allItems, this.curChar);
  }

  //Add Item To Character
  add(itemID: number, ind: number) {
    this.addSubmitted = true;

    // Call add Item function to post request to backend
    addItemtoCharacter(this.http, this.allChars, this.allItems, this.curChar, itemID, ind);
  }

  //Remove Item from Character
  remove(itemID: number, ind: number) {

    this.removeSubmitted = true;
    removeItemfromCharacter(this.http, this.allChars, this.allItems, this.curChar, itemID, ind)
  }


  IDToImage(ID: number): string {
    return IdToImage(ID);
  }
}
