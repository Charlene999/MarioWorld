import { HttpClient, } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { createSubmit, validName, validDescription } from './create-characters-helper'
@Component({
  templateUrl: './create-characters.component.html',
  styleUrls: ['./create-characters.component.css']
})

export class CreateCharactersComponent {
  allClasses: Array<string>;
  allLevels: Array<Number>;
  createSubmitted: Boolean;
  invalidName: string;
  invalidDesc: string;

  constructor(private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Create a Character");
    this.allClasses = ["Sorcerer", "Barbarian", "Bard", "Druid", "Shaman", "Hunter", "Necromancer", "Rogue", "Paladin", "Priest"];
    this.allLevels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    this.createSubmitted = false;
    this.invalidName ="";
    this.invalidDesc ="";
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(f: NgForm) {
    this.createSubmitted = true;

    // if any values are invalid do not send a post request to create character
    if (this.validName(f.value.name) || this.validDescription(f.value.description)) 
      return;

    const selectLevel = document.getElementById("character_dropdown") as HTMLSelectElement;
    let level = selectLevel.options[selectLevel.selectedIndex].value;
    
    const select = document.getElementById("class_dropdown") as HTMLSelectElement;
    let curClass = select.options[select.selectedIndex].value;
    createSubmit(this.http, this.router, curClass, f.value.name, f.value.description, parseInt(level));
  }

  // Sets alert to be returned if name is invalid, invalid name returns true (for ngif)
  validName(name: any): boolean {
    var retValue: number = validName(name, this.createSubmitted);

    switch (retValue) {
      case 2:
        this.invalidName = "Please enter a valid name";
        return true;

      case 3:
        this.invalidName = "Name Required";
        return true;

      case 4:
        this.invalidName = "Name must be at least 4 characters";
        return true;

      case 5:
        this.invalidName = "Name can have up to 20 characters";
        return true;

      default:
        return false;
    }
  }

  // Sets alert to be returned if description is invalid, invalid description returns true (for ngif)
  validDescription(description: any): boolean {
    var retValue: number = validDescription(description, this.createSubmitted);

    switch (retValue) {
      case 2:
        this.invalidDesc = "Please enter a valid description";
        return true;

      case 3:
        this.invalidDesc = "Description Required";
        return true;

      case 4:
        this.invalidDesc = "Description must be at least 4 characters";
        return true;

      case 5:
        this.invalidDesc = "Description can have up to 100 characters";
        return true;

      default:
        return false;
    }
  }
}
