import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export function submit(http: HttpClient, router: Router, username: string, password: string) {

  let existingUser = {
    username: username,
    password: password,
  }
  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/users/login', JSON.stringify(existingUser), options).subscribe((res: any) => {
    if (200) {

      let User = {
        "UserToken": res.token
      }
      const options = { headers: { 'Content-Type': 'application/json' } };
      http.post('http://localhost:8080/users/get', JSON.stringify(User), options).subscribe((data: any) => {
        if (200) {

          localStorage.setItem('username', username);
          if (data.IsAdmin === true) {
            // Log admin in using token
            localStorage.setItem('id_token', res.token);
            //Set adminstatus to true
            localStorage.setItem('adminstatus', 'true');
            //Adds a redirect to localhost:4200/admin (the admin profile page)
            router.navigateByUrl('/profile');
          }
          else {
            // Log user in using token
            localStorage.setItem('id_token', res.token);
            //Adds a redirect to localhost:4200/profile (the user profile page)
            router.navigateByUrl('/profile');
          }
        }
      });
    }
  }, (error) => {
    if (error.status === 404) {
      alert('Incorrect username or password.');
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
