import { HttpClient } from '@angular/common/http';
import { AllClasses, Item } from '../schemaHelper';

export function getAdminItems(http: HttpClient, allItems: Item[], allClasses: AllClasses) {

  let items = {
    "AdminToken": localStorage.getItem('id_token'),
  };

  const options = { headers: { 'Content-Type': 'application/json' } };

  // Get items from backend server
  http.post('http://localhost:8080/items/get', JSON.stringify(items), options).subscribe(data => {
    if (200) {
      // Show all items or hide them depending on when admin clicks

      allItems.splice(0);
      var AllItems = JSON.parse(JSON.stringify(data));
      for (let i = 0; i < AllItems.length; i++) {

        var ind: number;
        ind = AllItems[i].ClassReq as number;
        var item = new Item(AllItems[i].Name, AllItems[i].Description, AllItems[i].LevelReq, allClasses.getNames(ind), AllItems[i].ID, false);
        allItems.push(item);
      }
      localStorage.setItem('allUserItems', JSON.stringify(allItems));

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

export function updateAdminItems(http: HttpClient, allItems: Item[], name: string, desc: string, item: Item, ind: number) {

  //var convert: AllClasses = new AllClasses;
  // Item schema to match backend
  let Item =
  {
    "Name": name,
    "Description": desc,
    //"LevelReq": lev,
    //"ClassReq": myc,
    "ItemID": item.ID,
    "AdminToken": localStorage.getItem('id_token')
  }

  // Send request to edit item to backend
  http.put("http://localhost:8080/items/update", JSON.stringify(Item)).subscribe(data => {
    if (200) {
      allItems[ind].Name = name;
      allItems[ind].Description = desc;
      //allItems[ind].Class = convert.getNames(myc);
      //allItems[ind].Level = lev;
      alert("Item " + name + " successfully updated.");
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
  })
}

export function deleteAdminItems(http: HttpClient, name: string, id: number) {

  // If admin cancels delete request, it should not delete
  if (!confirm("Are you sure you want to delete item " + name + "?")) {
    alert("Deletion of item " + name + " canceled");
    return;
  }

  // Store admin token and item ID in options to send to delete request
  const opts = {
    headers: { 'Content-Type': 'application/json' },
    body: { "ItemID": id, "AdminToken": localStorage.getItem('id_token')! }
  };

  // Send delete request to backend
  http.delete('http://localhost:8080/items/delete', opts).subscribe(data => {

    if (200 || 202 || 204) {
      // Item successfully deleted
      alert("Item " + name + " deleted");
    }
  }, (error) => {
    if (error.status === 404) {
      alert('Item not found.');
    }
    else if (error.status === 409) {
      alert('Item already deleted. Please try to delete another one.');
    }
    else if (error.status === 500) {

      alert('Server down.');
    }
    else if (error.status === 502) {
      alert('Bad gateway.');
    }
  });
}
