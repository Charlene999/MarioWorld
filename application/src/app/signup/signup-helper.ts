import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
export function submit(http: HttpClient, router: Router, name: string, username: string, email: string, password: string) {
  let newUser = {
    name: name,
    username: username,
    email: email,
    password: password,
  }

  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/users/create', JSON.stringify(newUser), options).subscribe((res: any) => {
    if (201) {
      alert("Successful account creation.");
      //Redirect to user to login page
      router.navigateByUrl('/login');
    }
  }, (error) => {
    if (error.status === 404) {
      alert('Resource not found.');
    }
    else if (error.status === 409) {
      alert('Username already exists. Please try another one.');
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
