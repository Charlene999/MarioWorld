import { HttpClient } from '@angular/common/http';
import { Item, character, AllClasses } from '../../schemaHelper';

// Get user Characters
export function getUserCharacters(http: HttpClient, allChars: character[]) {
  let Character = {
    "OwnerToken": localStorage.getItem('id_token'),
  };

  const options = { headers: { 'Content-Type': 'application/json' } };
  // Get all user characters
  http.post('http://localhost:8080/characters/get', JSON.stringify(Character), options).subscribe(data => {
    if (200) {
      if (data === null)
        return;

      var chars = JSON.parse(JSON.stringify(data));
      allChars.splice(0);
      var className = "";
      var convert = new AllClasses;

      // Add characters to allChars variable
      for (var i = 0; i < chars.length; i++) {
        className = convert.getNames(chars[i].ClassType);
        var char = new character(chars[i].Name, chars[i].Level, className, chars[i].Description, chars[i].ID, chars[i].Items);
        allChars.push(char);
      }
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
  });
}

export function getCharacterItems(http: HttpClient, allChars: character[], allItems: Item[], curChar: character) {

  var convert: AllClasses = new AllClasses;
  var index = getSelectedCharacter(allChars);

  // Get selected index 
  if (index === -1)
    return;

  curChar = allChars[index]!;
  var level = curChar.Level;
  var compareClass = convert.getIndices(curChar.Class);

  const options = { headers: { 'Content-Type': 'application/json' } };
  var classCounter = 0;
  let FilterItems =
  {
    "LevelReq": level,
    "ClassReq": compareClass
  };


  http.post('http://localhost:8080/items/get', options).subscribe(data => {
    if (200) {

      var items = JSON.parse(JSON.stringify(data));

      //Get all items in the database
      for (var i = 0; i < items.length; i++) {

        if (items[i].ClassReq === compareClass && items[i].LevelReq <= level)
          classCounter += 1;
      }
      if (classCounter > 0) {
        // Only call server with request if items in database match character requirements
        http.post('http://localhost:8080/items/getfiltered', JSON.stringify(FilterItems), options).subscribe(mydata => {
          if (200) {
            if (mydata === null)
              return;

            var convert: AllClasses = new AllClasses;
            var items = JSON.parse(JSON.stringify(mydata));
            allItems.splice(0);
            //For all items in the database
            for (var i = 0; i < items.length; i++) {
              var ind: number = items[i].ClassReq;
              var classname: string = convert.getNames(ind);

              //Create new item object
              var item = new Item(items[i].Name, items[i].Description, items[i].LevelReq, classname, items[i].ID, false);
              //Push item into allItems array

              if (allChars.at(index)!.items.get(items[i].ID)) {
                allChars.at(index)!.items.get(items[i].ID)!.Owned = true;
                item.Owned = true;
              }
              else {
                item.Owned = false;
              }

              allItems.push(item);
            }
          }
        }, (error) => {
          if (error.status === 404) {
            alert('Resource not found.');
          }
          else if (error.status === 409) {
            alert('Item already exists. Please try another one.');
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

      else
        allItems.splice(0);
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

export function addItemtoCharacter(http: HttpClient, allChars: character[], allItems: Item[], curChar: character, itemID: number, ind: number) {
  var index = getSelectedCharacter(allChars);
  curChar = allChars[index];
  let addItem = {
    "ItemID": itemID,
    "OwnerToken": localStorage.getItem('id_token'),
    "CharacterID": curChar.ID,
  }
  if (itemOwned(allItems, ind)) {
    alert("Item already belongs to character");
    return;
  }

  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/characters/additem', JSON.stringify(addItem), options).subscribe(data => {
    if (200 || 202 || 204) {
      allItems[ind].Owned = true;
      allChars[index].items.clear();

      for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].Owned)
          allChars[index].items.set(allItems[i].ID, allItems[i]);
      }
      alert("Item added.");
    }
  },
    (error) => {
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

export function removeItemfromCharacter(http: HttpClient, allChars: character[], allItems: Item[], curChar: character, itemID: number, ind: number) {
  var index = getSelectedCharacter(allChars);
  curChar = allChars.at(index)!;
  const options = {
    headers: { 'Content-Type': 'application/json' },
    body: {
      "ItemID": itemID,
      "OwnerToken": localStorage.getItem('id_token'),
      "CharacterID": curChar.ID,
    }
  };

  if (!itemOwned(allItems, ind)) {
    alert("Item does not belong to character");
    return;
  }

  http.delete('http://localhost:8080/characters/removeitem', options).subscribe(data => {
    if (200 || 202 || 204) {
      allItems[ind].Owned = false;
      allChars[index].items.clear();

      for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].Owned)
          allChars[index].items.set(allItems[i].ID, allItems[i]);
      }
      alert("Item removed.");
    }
  },
    (error) => {
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

export function itemOwned(allItems: Item[], ind: number): boolean {

  if (allItems[ind].Owned === true) {
    return true;
  }
  else {
    return false;
  }
}

export function getSelectedCharacter(allChars: character[]): number {
  const select = document.getElementById("itemChars") as HTMLSelectElement;
  var index = select.selectedIndex;

  // Get selected index 
  if (index === 0 || index === -1 || index > allChars.length)
    return -1;

  return index - 1;
}
