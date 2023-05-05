import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {

  form: FormGroup = new FormGroup({});

  passwordSubmitted: boolean;

  constructor(private fb: FormBuilder, private http:HttpClient, private router:Router){ 
    this.passwordSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }
    
    this.form = this.fb.group({
      password: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20),]),
    })
  }

  onSubmit() {
    this.passwordSubmitted = true;

    let updateUser = {
      "UserToken": localStorage.getItem('id_token'),
      "Password": this.form.controls['password'].value,
    }

    const options = {headers: {'Content-Type': 'application/json'}};
    this.http.put('http://localhost:8080/users/update', JSON.stringify(updateUser), options).subscribe((res: any)=> {
        if(202) {
          alert("Password successfully updated.");
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
