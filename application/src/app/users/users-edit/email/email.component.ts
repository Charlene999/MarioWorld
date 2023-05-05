import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {

  form: FormGroup = new FormGroup({});

  emailSubmitted: boolean;

  constructor(private fb: FormBuilder, private http:HttpClient, private router:Router){ 
    this.emailSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }

    this.form = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email,]),
    })
  }

  onSubmit() {
    this.emailSubmitted = true;

    let updateUser = {
      "UserToken": localStorage.getItem('id_token'),
      "Email": this.form.controls['email'].value,
    }

    const options = {headers: {'Content-Type': 'application/json'}};
    this.http.put('http://localhost:8080/users/update', JSON.stringify(updateUser), options).subscribe((res: any)=> {
        if(202) {
          alert("Email successfully updated.");
          //Redirect to user to login page
          this.router.navigateByUrl('/profile');
        }
      }, (error) => {
        if (error.status === 404) {
          alert('Resource not found.');
        }
        else if (error.status === 500) {
          alert('Server down.');
        }
        else if (error.status === 502) {
          alert('Bad gateway.');
        }
      }
    );
  }

}
