import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AllClasses } from '../schemaHelper';
@Component({
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})

export class ClassesComponent {

  classList: Array<string>
  firstButtonClicked: Boolean;
  secondButtonClicked: Boolean;
  thirdButtonClicked: Boolean;
  fourthButtonClicked: Boolean;
  fifthButtonClicked: Boolean;
  sixthButtonClicked: Boolean;
  seventhButtonClicked: Boolean;
  eighthButtonClicked: Boolean;
  ninthButtonClicked: Boolean;
  tenthButtonClicked: Boolean;

  constructor(private router: Router, private title: Title) {
    title.setTitle("Classes");
    var classes = new AllClasses;
    this.classList = classes.allClasses;
    this.firstButtonClicked = false;
    this.secondButtonClicked = false;
    this.thirdButtonClicked = false;
    this.fourthButtonClicked = false;
    this.fifthButtonClicked = false;
    this.sixthButtonClicked = false;
    this.seventhButtonClicked = false;
    this.eighthButtonClicked = false;
    this.ninthButtonClicked = false;
    this.tenthButtonClicked = false;
  }

  //If user is not logged in, redirect to home page
  ngOnInit() {
    if (localStorage.getItem('id_token') === null) {
      this.router.navigateByUrl('/');
    }
  }

  submit(f: Number) {
    switch (f) {
      case 1:
        this.firstButtonClicked = true;
        alert("The visionary works to destroy his enemies through the elements of obscurity and vision loss");
        break;
      case 2:
        this.secondButtonClicked = true;
        alert("The fearsome slippery spy leaves weapons of destruction where you least expect it. Keep a watchful eye out!");
        break;
      case 3:
        this.thirdButtonClicked = true;
        alert("The ice master is proficient in the frozen elements. Through the awesomness of absolute zero he eliminates his enemies");
        break;
      case 4:
        this.fourthButtonClicked = true;
        alert("The flammable detonator has mastered the art of explosion. One false step from his enemies and they are no more.");
        break;
      case 5:
        this.fifthButtonClicked = true;
        alert("The phase-changing accelerator attacks enemies at lightning speeds. You won't see him, but you will feel his effects.");
        break;
      case 6:
        this.sixthButtonClicked = true;

        alert("The sharp shooter never misses a target. Any opponent in his way must be destroyed");
        break;
      case 7:
        this.seventhButtonClicked = true;
        alert("The shell shooter uses the Koopa capability to thwart its enemies through the use of Koopa shells");
        
        break;
      case 8:
        this.eighthButtonClicked = true;
        alert("The animalist uses animals' flight and strength capabilities to overpower his enemies");
        break;
      case 9:
        this.ninthButtonClicked = true;
        alert("The paladin is a warrior that knows no boundaries. He extends his might to overpower any enemy in sight... in seconds.");
        break;
      case 10:
        this.tenthButtonClicked = true;
        alert("The avenger is Earth's Mightiest Hero! Whether Thanos, Kang, or even the Mandarin, this hero wipes out ALL enemies in sight!");
        break;
      default:
        alert("Invalid class choice.");
        break;
    }
  }
}
