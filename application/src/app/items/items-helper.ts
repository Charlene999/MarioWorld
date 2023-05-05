import { HttpClient } from '@angular/common/http';
import { Item, AllClasses } from '../schemaHelper';

export function getItems(http: HttpClient, allItems: Item[])
{

  const options = { headers: { 'Content-Type': 'application/json' } };
  http.post('http://localhost:8080/items/get', options).subscribe(data => {
    if (200) {
      if (data === null)
        return;

      var items = JSON.parse(JSON.stringify(data));
      allItems.splice(0);
      var classReq = "";
      //For all items in the database
      for (var i = 0; i < items.length; i++) {
        var convert: AllClasses = new AllClasses;
        var ind: number = items[i].ClassReq;
        classReq = convert.getNames(ind);

        var item = new Item(items[i].Name, items[i].Description, items[i].LevelReq, classReq, items[i].ID, false);
        allItems.push(item);
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
  }
  );
}

export function showItems(allItems: Item[], curClassItems: Item[], curClass: string) {
  if (curClass !== "All Items") {
    curClassItems.splice(0);

    //For loop that goes through all items in allItems
    for (let item = 0; item < allItems.length; item++) {
      if (curClass === allItems[item].Class) {
        //Push item into allItems array
        curClassItems.push(allItems[item]);
      }
    }
  }
}
