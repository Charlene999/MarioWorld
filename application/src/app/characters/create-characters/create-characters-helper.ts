import { HttpClient } from '@angular/common/http';
import { AllClasses } from '../../schemaHelper';
import { Router } from '@angular/router';
export function createSubmit(http: HttpClient, router: Router, className: string, name: string, description: string, level: number) {
  var classes: AllClasses = new AllClasses;

  var classInt = classes.getIndices(className);

  let Character = {
    "Name": name,
    "Description": description,
    "ClassType": classInt,
    "Level": level,
    "OwnerToken": localStorage.getItem('id_token'),
  };

  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/characters/create', JSON.stringify(Character), options).subscribe((res: any) => {
    if (200) {
      alert("Successful character creation.");
      router.navigateByUrl('/profile/characters');
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
  }
  );
}

export function validName(name: any, submit: Boolean): number {

  if (submit === false)
    return 1;

  if (typeof (name) !== 'string') 
    return 2;
  
  if (name.length === 0) 
    return 3;

  if (name.length < 4)
    return 4;

  if (name.length > 20) 
    return 5;

  return 1;
}

export function validDescription(description: any, submit: Boolean): number {

  if (submit === false)
    return 1;

  if (typeof (name) !== 'string')
    return 2;

  if (description.length === 0)
    return 3;

  if (description.length < 4)
    return 4;

  if (description.length > 20)
    return 5;

  return 1;
}
