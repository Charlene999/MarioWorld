import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent {

  Name: string;
  Username: string;
  Email: string;
  Directions: string;

  editNameSubmitted: Boolean;
  editEmailSubmitted: Boolean;
  editPasswordSubmitted: Boolean;

  newCharactersSubmitted: Boolean;
  viewCharactersSubmitted: Boolean;
  viewCharactersSpellsSubmitted: Boolean; 
  viewCharactersItemsSubmitted: Boolean;

  form = new FormGroup({  
    website: new FormControl('', Validators.required),
  });

  constructor(private http: HttpClient, private router: Router, private title: Title) {
    var name = JSON.stringify(localStorage.getItem("username"));

    title.setTitle(name.substring(1, name.length-1));

    this.Name = "";
    this.Username = "";
    this.Email = "";
    this.Directions = "Select a Profile Field to Update";

    this.editNameSubmitted = false; 
    this.editEmailSubmitted = false;
    this.editPasswordSubmitted = false; 

    this.newCharactersSubmitted = false; 
    this.viewCharactersSubmitted = false;
    this.viewCharactersSpellsSubmitted = false; 
    this.viewCharactersItemsSubmitted = false; 
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }

    let User = {
      "UserToken": localStorage.getItem('id_token')
    }

    const options = { headers: { 'Content-Type': 'application/json' } };
    this.http.post('http://localhost:8080/users/get', JSON.stringify(User), options).subscribe((data: any) => {
      if (200) {
        this.Name = data.Name;
        this.Username = data.Username;
        this.Email = data.Email;
      }
    })
  }

  get f(){  
    return this.form.controls;  
  }
    
  submit(){  
    if(this.form.value.website === 'Update Name') {
      this.editNameSubmitted = true;
      this.router.navigateByUrl("/profile/name");
    }

    if(this.form.value.website === 'Update Email') {
      this.editEmailSubmitted = true;
      this.router.navigateByUrl("/profile/email");
    }

    if(this.form.value.website === 'Update Password') {
      this.editPasswordSubmitted = true;
      this.router.navigateByUrl("/profile/pass");
    }
  }

}
