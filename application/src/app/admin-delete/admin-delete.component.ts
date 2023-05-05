import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Item, AllClasses, IdToImage } from '../schemaHelper';
import { deleteAdminItems, getAdminItems, updateAdminItems } from './admin-delete-helper';
import { isNumber } from 'cypress/types/lodash';

@Component({
  selector: 'app-admin-delete',
  templateUrl: './admin-delete.component.html',
  styleUrls: ['./admin-delete.component.css']
})
export class AdminDeleteComponent {
  allClasses: AllClasses;
  allItems: Item[];
  curClass: string;
  curClassItems: Item[];
  Itemtext: string;
  itemview: boolean;
  ItemValid: boolean;
  viewItemsSubmitted: Boolean;
  deleteItemSubmitted: Boolean;
  searchText: any;

  constructor(private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Edit Items");
    this.allClasses = new AllClasses;
    this.itemview = false;
    this.Itemtext = "Hide All Items";
    this.ItemValid = true;
    this.allItems = [];
    this.curClass = "All Items";
    this.curClassItems = [];
    this.viewItemsSubmitted = false;
    this.deleteItemSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null || localStorage.getItem('adminstatus') !== 'true')
      this.router.navigateByUrl('/');

    this.getAllItems();
  }

  // Allow admin to show and hide ALL items
  viewItems() {
    this.viewItemsSubmitted = true;
    // Hide table if button pressed
    if (document.getElementById('itemTabl')?.style.visibility === "hidden") {
      this.Itemtext = "Hide All Items";
      var tablRow = document.getElementById('itemTabl');
      tablRow!.style.visibility = "visible";
      return;
    }

    else {
      var tablRow = document.getElementById('itemTabl');
      this.Itemtext = "View All Items";
      tablRow!.style.visibility = "hidden";
      return;
    }
  }

  // Delete Item
  deleteItem(id: number, name: string) {
    this.deleteItemSubmitted = true;

    // Delete helper function
    deleteAdminItems(this.http, name, id);

    this.getAllItems();
    this.showItems();
  }

  // Edit Item
  editItem(item: Item, index: number) {
    // Get data admin entered
    var table = document.getElementById("itemTable") as HTMLTableElement;
    var name = table.rows[index + 2]?.cells[1]?.innerText;
    var desc = table.rows[index + 2]?.cells[2]?.innerText;
    var tableLevel = table.rows[index + 2]?.cells[3]?.innerText;
    var tableClass = table.rows[index + 2]?.cells[4]?.innerText;
    var level = parseInt(tableLevel);

    var myClass;
    if (this.allClasses.justClasses.includes(tableClass)) {
      myClass = this.allClasses.getIndices(this.allItems[index].Class);
    }

    else
      myClass = parseInt(tableClass);

    // Don't post request if item data is invalid
    if (!this.itemValid(name, desc))
      //, level, myClass))
      return;

    // Edit items
    updateAdminItems(this.http, this.allItems, name, desc, item, index);
    //console.log(this.allItems);
    this.getAllItems();
    this.showItems();
  }

  // Item Validation
  itemValid(itemName: string, itemDesc: string//, itemLevel: any, itemClass: any
  ): boolean {
    // Validate edit item with add item validation
    var itemname = "", itemdesc = "";//, itemlevel = "", itemclass = "";
    var valItem = document.getElementById("itemValid") as HTMLTableRowElement;
    var descVal = new RegExp('[a-zA-Z.,? ]*');

    if (!descVal.test(itemDesc)) 
      itemdesc = "Description contains invalid characters"

    if (itemDesc.length < 4) 
      itemdesc = "Description must be at least 4 characters"

    if (itemDesc.length > 100) 
      itemdesc = "Description cannot exceed 100 characters"

    var nameVal = new RegExp('[a-zA-Z ]*');

    if (!nameVal.test(itemName)) 
      itemname = "Name contains invalid characters"

    if (itemName.length < 4) 
      itemname= "Name must be at least 4 characters"

    if (itemName.length > 30) 
      itemname = "Name cannot exceed 30 characters"

    /*
    if (Number.isNaN(itemLevel))
      itemlevel = "Please enter a valid integer for level";

    else {
      if (itemLevel < 1 || itemLevel > 20)
        itemlevel = "Item level must be between 1 and 20 (inclusive)";
    }

    if (Number.isNaN(itemClass))
      itemclass = "Please enter a valid integer for class"

    else {
      if (itemClass < 1 || itemClass > 10)
        itemclass = "Item class must be between 1 and 10 (inclusive)";
    }*/
    valItem.innerHTML = "";
    if (itemname == "" && itemdesc == ""
      //&& itemlevel == "" && itemclass == ""
    ) {
      this.ItemValid = true;
      return this.ItemValid;
    }

    if (itemname != "")
    {
      valItem.innerHTML += itemname;
      valItem.innerHTML += "<br>";
      this.ItemValid = false;
    }
    if (itemdesc != "") {
      valItem.innerHTML += itemdesc;
      valItem.innerHTML += "<br>";
      this.ItemValid = false;
    }
    /*
    if (itemlevel != "") {
      valItem.innerHTML += itemlevel;
      valItem.innerHTML += "<br>";
      this.ItemValid = false;
    }

    if (itemclass != "") {
      valItem.innerHTML += itemclass;
      this.ItemValid = false;
    }
    */
    return this.ItemValid;
  }

  All() {
    if (this.curClass === "All Items")
      return true;

    else
      return false;
  }

  showItems() {

    const select = document.getElementById("classSel") as HTMLSelectElement;
    const index = select.selectedIndex;

    if (index === 0 || index == -1 || index > this.allClasses.allClasses.length)
      return;


    var valItem = document.getElementById("itemValid") as HTMLTableRowElement;

    valItem.innerHTML = "";
    this.curClass = this.allClasses.allClasses.at(index - 1) as string;

    if (this.curClass !== "All Items") {
      this.curClassItems.splice(0);

      //For loop that goes through all items in allItems and adds based on class
      for (let item = 0; item < this.allItems.length; item++)
        if (this.curClass === this.allItems[item].Class) 
          this.curClassItems.push(this.allItems[item]);
    }
  }

  getAllItems() {
    // All items and should show on page load

    getAdminItems(this.http, this.allItems, this.allClasses);
  }

  IDToImage(ID: number): string {
    return IdToImage(ID);
  }
}

