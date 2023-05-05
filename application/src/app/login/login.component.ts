import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { submit } from './login-helper';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  form: FormGroup = new FormGroup({});
  
  loginSubmitted: Boolean;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Login");
    this.loginSubmitted = false; 
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') !== null) {
      this.router.navigateByUrl('/');
    }

    //The input form is defined here along with the validators
    this.form = this.fb.group({
      username: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]*')]),
      password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20),]),
    })
  }

  onSubmit() {
    this.loginSubmitted = true;

    // Call submit function to send request to backend server
    submit(this.http, this.router, this.form.controls['username'].value, this.form.controls['password'].value);
  }
}
