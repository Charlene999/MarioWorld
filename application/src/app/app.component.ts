import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent { 

  hover: boolean;
  constructor(private router: Router, private title: Title) {
    this.hover = false;
  }
  
  loggedIn() {
    if (localStorage.getItem('id_token') === null) {
      return false;
    } else {
      return true;
    }
  }
  
  logout() {
    //Deletes all adminstatus and id_token cookies
    localStorage.clear();
    //Redirect to home page
    this.router.navigateByUrl('/');
  }

  isAdmin() {
    if (localStorage.getItem('adminstatus') === 'true') {
      return true;
    }
    else {
      return false;
    }
  }

  // Get user option from select
  profileChoice() {

    var select = document.getElementById("chars") as HTMLSelectElement;
    switch (select.selectedIndex) {
      case 1:
        this.router.navigateByUrl("/profile/create-character");
        break;

      case 2:
        this.router.navigateByUrl("/profile/characters");
        break;

      case 3:
        this.router.navigateByUrl("/profile/items");
        break;

      default:
        break;
    }

    select.selectedIndex = 0;
  }

  // Get admin option from select
  adminChoice() {

    var select = document.getElementById("adminProf") as HTMLSelectElement;
    switch (select.selectedIndex) {
      case 1:
        this.router.navigateByUrl("/admin/view-users");
        break;

      case 2:
        this.router.navigateByUrl("/admin/add-items");
        break;

      case 3:
        this.router.navigateByUrl("/admin/delete-items");
        break;

      default:
        break;
    }

    select.selectedIndex = 0;
  }

}
