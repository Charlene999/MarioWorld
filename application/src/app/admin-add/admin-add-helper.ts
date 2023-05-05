import { HttpClient } from '@angular/common/http';

// Admin add Item Function
export function createItem(http: HttpClient, name: string, desc: string, Class: number, level: number)
{
  let BuildItem = {
    "AdminToken": localStorage.getItem('id_token'),
    "Name": name,
    "Description": desc,
    "LevelReq": level,
    "ClassReq": Class,
  }

  const options = { headers: { 'Content-Type': 'application/json' } };

  // Send create request to backend server
  http.post('http://localhost:8080/items/create', JSON.stringify(BuildItem), options).subscribe((res: any) => {
    if (200) {
      // Show item as created
      alert("Item " + name + " Successfully Created");
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
