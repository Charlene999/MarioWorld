import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUsersComponent } from './view-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ViewUsersComponent', () => {
  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ ViewUsersComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /admin/view-users page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('viewUsers', () => {
    it('View All Users Works', async () => {
      component.viewUsers();
      expect(component.viewUsersSubmitted).toBeTruthy();
    });
  });

  describe('deleteUser', () => {
    it('Delete User Button Works', async () => {
      //NOTE: This test just tests that the button works, not
      //the functionality. See Cypress testing for that.
      component.deleteUser('');
      expect(component.viewUsersSubmitted).toBeTruthy();
    });
  });

});
