import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  loginSubmitted: Boolean;
  signupSubmitted: Boolean;

  constructor(private router: Router, private title: Title) {
    title.setTitle("The Perfect Path");
    this.loginSubmitted = false; 
    this.signupSubmitted = false; 
  }

  loggedIn() {
    if (localStorage.getItem('id_token') === null) {
      return false;
    } 
    else {
      return true;
    }
  }

  login() {
    this.loginSubmitted = true;
    this.router.navigateByUrl("/login");
  }

  signup() {
    this.signupSubmitted = true; 
    this.router.navigateByUrl("/signup");
  }
}
