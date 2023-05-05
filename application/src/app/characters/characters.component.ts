import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { character } from '../schemaHelper';
import { AllClasses } from '../schemaHelper';
import { deleteCharacter, editCharacter, getCharacters } from './characters-helper';

@Component({
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})

export class CharactersComponent {

  allClasses: AllClasses;
  allChars: character[];
  viewSubmitted: Boolean;
  curClass: string;
  curClassChars: character[];
  CharValid: boolean;
  searchText: any;
  constructor(private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Characters");
    this.allChars = [];
    this.allClasses = new AllClasses;
    this.viewSubmitted = false;
    this.curClass = "All Characters";
    this.curClassChars = [];
    this.CharValid = true;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }
    
    getCharacters(this.http, this.allChars);
  }

  onLoad() {

    this.viewSubmitted = true;
    getCharacters(this.http, this.allChars);
  }

  deleteCharacter(name: String, id: number) {
    deleteCharacter(this.http, name, id);
  }

  editCharacter(char: character, index: number) {

    // Get info from html table
    var table = document.getElementById('tabl') as HTMLTableElement;
    var name = table.rows[index + 2]?.cells[0]?.innerText;
    var desc = table.rows[index + 2]?.cells[1]?.innerText;
    var myclass = char.Class;

    // Don't post request if spell data is invalid
    if (!this.charValid(name, desc))
      return;

    let myclassconvert = this.allClasses.getIndices(myclass);

    editCharacter(this.http, this.allChars, name, desc, myclassconvert, char.Level, char.ID);
  }

  showChars() {
    const select = document.getElementById("charClasses") as HTMLSelectElement;
    const index = select.selectedIndex;

    if (index === 0 || index == -1 || index > this.allClasses.allCharacters.length)
      return;

    this.viewSubmitted = true;

    this.curClass = this.allClasses.allCharacters.at(index - 1) as string;

    if (this.curClass !== "All Characters") {
      this.curClassChars.splice(0);

      //For loop that goes through all items in allItems
      for (let char = 0; char < this.allChars.length; char++) {
        if (this.curClass === this.allChars[char].Class) {
          //Push item into allItems array
          this.curClassChars.push(this.allChars[char]);
        }
      }
    }
  }

  charValid(charName: string, charDesc: string): boolean {

    // Validate edit character with add character validation
    var charname = "", chardesc = "";
    var valChar = document.getElementById("charValid") as HTMLTableRowElement;
    var descVal = new RegExp('[a-zA-Z.,? ]*');

    if (!descVal.test(charDesc))
      chardesc = "Description contains invalid characters"

    if (charDesc.length < 4)
      chardesc = "Description must be at least 4 characters"

    if (charDesc.length > 100)
      chardesc = "Description cannot exceed 100 characters"

    var nameVal = new RegExp('[a-zA-Z ]*');

    if (!nameVal.test(charName))
      charname = "Name contains invalid characters"

    if (charName.length < 4)
      charname = "Name must be at least 4 characters"

    if (charName.length > 30)
      charname = "Name cannot exceed 30 characters"

    if (charname == "" && chardesc == "") {
      valChar.innerHTML = "";
      this.CharValid = true;
      return this.CharValid;
    }

    else if (charname != "" && chardesc == "") {
      valChar.innerHTML = charname;
      this.CharValid = false;
      return this.CharValid;
    }

    else if (charname == "" && chardesc != "") {
      valChar.innerHTML = chardesc;
      this.CharValid = false;
      return this.CharValid;
    }

    else {
      valChar.innerHTML = charname + "<br>" + chardesc;
      this.CharValid = false;
      return this.CharValid;
    }
  }

  All() {
    if (this.curClass === "All Characters") {
      return true;
    }
    else {
      return false;
    }
  }
}
