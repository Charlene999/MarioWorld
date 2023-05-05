import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser'
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  constructor(private title: Title) {
    title.setTitle("Help");
  }
}
