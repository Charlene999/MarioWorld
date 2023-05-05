import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { myUser } from '../schemaHelper';
import { deleteUsers, editUsers, viewUsers } from './view-users-helper';

@Component({
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})

export class ViewUsersComponent {
  Users: myUser[];
  curUser: myUser;
  text: string;
  view: boolean;
  viewUsersSubmitted: Boolean;
  deleteUserSubmitted: Boolean;
  editUsersSubmitted: Boolean;
  // Stores user edit form data
  form: FormGroup = new FormGroup({});

  searchText: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Users");
    this.Users = [];
    this.curUser = new myUser("Name", "Username", "Email", -1, false, "********");
    this.text = "Hide All Users";
    this.view = false;
    this.viewUsersSubmitted = false;
    this.editUsersSubmitted = false;
    this.deleteUserSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null || localStorage.getItem('adminstatus') !== 'true') {
      this.router.navigateByUrl('/');
    }

    this.viewUsers();

    // Same validation here as signup form validation
    this.form = this.fb.group({
      name: new FormControl("", [Validators.minLength(4), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl("", [Validators.email,]),
      password: new FormControl("", [Validators.minLength(8), Validators.maxLength(20),]),
    })
  }

  // Allow admin to view all characters
  viewUsers() {

    this.viewUsersSubmitted = true;

    // Call viewUsers helper function to get user data from backend server
    viewUsers(this.http, this.Users);
  }

  // Get admin user option
  chooseUser() {
    const select = document.getElementById("chooseUser") as HTMLSelectElement;
    const index = select.selectedIndex;

    // Get selected index 
    if (index === 0 || index === -1 || index - 1 >= this.Users.length)
      return;

    // Current character equals user's selected option'
    var user = this.Users.at(index - 1)!;
    this.curUser = user;
  }

  // Edit user with admin info
  editUser() {
    // double check if submitted form is valid
    if (!this.form.valid)
      return;

    const select = document.getElementById("chooseUser") as HTMLSelectElement;
    const index = select.selectedIndex;

    // Get selected index 
    if (index === 0 || index === -1 || index - 1 >= this.Users.length)
      return;

    // Only update values that admin entered
    const name = document.getElementById("name") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const pwd = document.getElementById("password") as HTMLInputElement;
    const adm = document.getElementById("Adm") as HTMLInputElement;

    this.curUser = this.Users.at(index - 1)!;

    if (name.value != "")
      this.curUser.Name = name.value;

    if (email.value != "") 
      this.curUser.Email = email.value;

    if (pwd.value)
      this.curUser.Password = pwd.value;

    if (adm.checked === true) 
      this.curUser.IsAdmin = true;

    if (confirm("Warning! Are you sure you want to edit this user? This is potentially a destructive action!")) {
      // Post admin and user data to edit user

      if (pwd.value)
        editUsers(this.http, this.curUser.Username, this.curUser.Name, this.curUser.Email, this.curUser.Password, this.curUser.IsAdmin, true)

      else
        editUsers(this.http, this.curUser.Username, this.curUser.Name, this.curUser.Email, this.curUser.Password, this.curUser.IsAdmin, false)

      this.editUsersSubmitted = false;
    }
  }

  // Admin can click to delete users
  deleteUser(username: string) {
    this.deleteUserSubmitted = true;

    // Call helper to send delete request to backend server
    deleteUsers(this.http, username);
  }

  viewHide() {
    if (document.getElementById('tableData')?.style.visibility === "hidden")
    {
      this.text = "Hide All Users";
      var tablRow = document.getElementById('tableData');
      tablRow!.style.visibility = "visible";
      return;
    }

    else {
      var tablRow = document.getElementById('tableData');
      this.text = "View All Users";
      tablRow!.style.visibility = "hidden";
      return;
    }
  }

  edited(){
    
    if (this.editUsersSubmitted === false) {
      this.editUsersSubmitted = true;
    }

    return this.editUsersSubmitted;
  }

  back() {
    this.router.navigateByUrl("/profile");
  }
}
