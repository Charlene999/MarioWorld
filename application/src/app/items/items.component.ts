import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Item } from '../schemaHelper';
import { AllClasses, IdToImage } from '../schemaHelper';
import { getItems, showItems } from './items-helper';

@Component({
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent {

  allClasses: AllClasses;
  curClass: string;
  allItems: Item[];
  curClassItems: Item[];
  viewSubmitted: Boolean;
  searchText: any;

  constructor(private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Items");
    this.allClasses = new AllClasses;
    this.allItems = [];
    this.curClass = "All Items";
    this.curClassItems = [];
    this.viewSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }

    // Show all items on load
    this.getAllItems();
  }

  // show all items owned and unowned for that class and level
  showItems() {

    this.viewSubmitted = true;

    const select = document.getElementById("classes") as HTMLSelectElement;
    const index = select.selectedIndex;

    if (index === 0 || index == -1 || index > this.allClasses.allClasses.length)
      return;

    this.curClass = this.allClasses.allClasses.at(index - 1)!;

    showItems(this.allItems, this.curClassItems, this.curClass);
  }

  // Table shows current items when this function is called
  getAllItems() {
    getItems(this.http, this.allItems);
  }
  All() {
    if (this.curClass === "All Items") 
      return true;

    else 
      return false;
  }

  IDToImage(ID: number): string {
    return IdToImage(ID);
  }
}
