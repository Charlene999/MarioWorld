
import { HttpClient } from '@angular/common/http';
import { myUser } from '../schemaHelper';

export function viewUsers(http: HttpClient, Users: myUser[]) {
{
    // Post admin variable to get all users
    let Admin = {
      "UserToken": localStorage.getItem('id_token'),
    };
    const options = { headers: { 'Content-Type': 'application/json' } };
    http.post('http://localhost:8080/users/getall', JSON.stringify(Admin), options).subscribe(data => {

      if (200) {
        // All users in Users variable and stored in table
        Users.splice(0);
        var users = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < users.length; i++) {
          var user = new myUser(users[i].Name, users[i].Username, users[i].Email, users[i].ID, users[i].IsAdmin, users[i].Password);
          Users.push(user);
        }
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found.');
      }
      else if (error.status === 409) {
        alert('Character already exists. Please try another one.');
      }
      else if (error.status === 500) {
        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    })
  }
}

export function deleteUsers(http: HttpClient, username: string) {

  if (confirm("Are you sure you want to permanently delete this user?")) {
    const opts = { headers: { 'Content-Type': 'application/json' }, body: { "AuthToken": localStorage.getItem('id_token'), "Username": username, } };
    http.delete('http://localhost:8080/users/delete', opts).subscribe(data => {
      if (202) {
        alert("User " + username + " deleted permanently.");
        window.location.reload();
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found');
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
  else {
    alert("User deletion canceled.");
  }
}

export function editUsers(http: HttpClient, username: string, name: string, email: string, password: string, IsAdmin: boolean, pwd: boolean) {
  const options = { headers: { 'Content-Type': 'application/json' } };
  if (confirm("Warning! Are you sure you want to edit this user? This is potentially a destructive action!")) {

    // Post admin and user data to edit user
    var Admin;

    if (pwd) {
      Admin = {
        "AuthToken": localStorage.getItem('id_token'),
        "Username": username,
        "Name": name,
        "Email": email,
        "Password": password,
        "IsAdmin": IsAdmin,
      }

    }
    else {
      Admin = {
        "AuthToken": localStorage.getItem('id_token'),
        "Username": username,
        "Name": name,
        "Email": email,
        "IsAdmin": IsAdmin,
      }
    }
    http.put('http://localhost:8080/users/admin_update', JSON.stringify(Admin), options).subscribe(data => {
      if (200) {
        alert("User " + username + " successfully updated.");
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Resource not found.');
      }
      else if (error.status === 409) {
        alert('User already exists. Please try another one.');
      }
      else if (error.status === 500) {
        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    })

  }
}
