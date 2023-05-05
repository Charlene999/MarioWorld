import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AllClasses } from '../schemaHelper'
import { createItem } from './admin-add-helper';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.css']
})
export class AdminAddComponent {

  itemForm: FormGroup = new FormGroup({});
  allClasses: AllClasses;
  allLevels: Array<Number>;

  itemSubmitted: Boolean;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Create Items | Spells");
    this.allClasses = new AllClasses;
    this.allLevels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    this.itemSubmitted = false;
  }

  ngOnInit() {
    // Route back to home if admin is not logged in
    if (localStorage.getItem('id_token') === null || localStorage.getItem('adminstatus') !== 'true')
      this.router.navigateByUrl('/');

    this.itemForm = this.fb.group({
      itemname: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]),
      itemdescription: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(100), Validators.pattern('[a-zA-Z.,? ]*')]),
    })
  }

  // New Item Submitted
  submitItem() {
    this.itemSubmitted = true;

    const selectLevel = document.getElementById("character_dropdown_item") as HTMLSelectElement;
    let level = selectLevel.options[selectLevel.selectedIndex].value;
    
    const select = document.getElementById("class_dropdown_item") as HTMLSelectElement;
    let curClass = select.options[select.selectedIndex].value;
    let currentClass = 0;

    currentClass = this.allClasses.getIndices(curClass);

    if (currentClass <= 0)
      return;

    createItem(this.http, this.itemForm.controls['itemname'].value, this.itemForm.controls['itemdescription'].value, currentClass, parseInt(level));
  }

  itemreset() {
    this.itemForm.reset();
  }
}
