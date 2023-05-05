import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { submit } from './signup-helper';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  form: FormGroup = new FormGroup({});

  signUpSubmitted: boolean;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private title: Title) {
    title.setTitle("Signup");
    this.signUpSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') !== null) {
      this.router.navigateByUrl('/');
    }

    this.form = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]),
      username: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]*')]),
      email: new FormControl("", [Validators.required, Validators.email,]),
      password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20),]),
    })
  }

  onSubmit() {
    this.signUpSubmitted = true;

    submit(this.http, this.router, this.form.controls['name'].value, this.form.controls['username'].value,
      this.form.controls['email'].value, this.form.controls['password'].value)
  }

  reset() {
    this.form.reset();
  }
}
