import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent {

  form: FormGroup = new FormGroup({});

  nameSubmitted: boolean;

  constructor(private fb: FormBuilder, private http:HttpClient, private router:Router){ 
    this.nameSubmitted = false;
  }

  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }

    //The input form is defined here along with the validators
    this.form = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]),
    })
  }

  onSubmit() {
    this.nameSubmitted = true;

    let updateUser = {
      "UserToken": localStorage.getItem('id_token'),
      "Name": this.form.controls['name'].value,
    }

    const options = {headers: {'Content-Type': 'application/json'}};
    this.http.put('http://localhost:8080/users/update', JSON.stringify(updateUser), options).subscribe((res: any)=> {
        if(202) {
          alert("Name successfully updated.");
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
