import { HttpClient } from '@angular/common/http';
import { character } from '../schemaHelper';
import { AllClasses } from '../schemaHelper';

export function editCharacter(http: HttpClient,allChars: character[], name: string, desc: string, myclassconvert: number, level: number, id: number) {

  // Create character from edited info according to backend schema
  let Character = {
    "Name": name,
    "Description": desc,
    "ClassType": myclassconvert,
    "Level": level,
    "OwnerToken": localStorage.getItem('id_token'),
    "CharacterID": id,
  }

  const options = { headers: { 'Content-Type': 'application/json' } };
  var convert: AllClasses = new AllClasses;
  // Confirm if user wants to edit character and edit
  if (confirm("Are you sure you want to edit this character?")) {
    http.put('http://localhost:8080/characters/update', JSON.stringify(Character), options).subscribe(data => {
      if (200) {
        // Character should be updated in allChars variable 
        var curChar = JSON.parse(JSON.stringify(data));

        var char = new character(curChar.Name, curChar.Level, convert.getNames(myclassconvert), curChar.Description, curChar.ID, curChar.Items);
        getCharacters(http, allChars);

        alert("Character " + char.Name + " Updated");
        window.location.reload;
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
}

export function deleteCharacter(http: HttpClient, name: String, id: number) {

  if (confirm('Are you sure you want to delete character ' + name + '?') === true) {

    // Store admin token and item ID in options to send to delete request
    const opts = {
      headers: { 'Content-Type': 'application/json' }, body: { "CharacterID": id, "OwnerToken": localStorage.getItem('id_token')! }
    };
    http.delete('http://localhost:8080/characters/delete', opts).subscribe(data => {

      if (200 || 202 || 204) {
        // Character successfully deleted
        alert("Character " + name + " Deleted");
        window.location.reload();
      }
    }, (error) => {
      if (error.status === 404) {
        alert('Character not found.');
      }
      else if (error.status === 409) {
        alert('Character already deleted. Please try to delete another one.');
      }
      else if (error.status === 500) {

        alert('Server down.');
      }
      else if (error.status === 502) {
        alert('Bad gateway.');
      }
    });
  }
}

export function getCharacters(http: HttpClient, allChars: character[])
{
  var convert: AllClasses = new AllClasses;

  let Character = {
    "OwnerToken": localStorage.getItem('id_token'),
  };

  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/characters/get', JSON.stringify(Character), options).subscribe(data => {
    if (200) {

      // All user characters put in a variable for html table access
      allChars.splice(0);
      var chars = JSON.parse(JSON.stringify(data));

      for (let i = 0; i < chars.length; i++) {
        var ind: number = chars[i].ClassType;
        var className = convert.getNames(ind);

        var char = new character(chars[i].Name, chars[i].Level, className, chars[i].Description, chars[i].ID, chars[i].Items);
        allChars.push(char);
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
  }
  );
}
