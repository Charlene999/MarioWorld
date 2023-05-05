import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ UsersComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('The /profile page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('Update Name Option Works', async () => {
      component.form.value.website = "Update Name";
      component.submit();
      expect(component.editNameSubmitted).toBeTruthy();
    });

    it('Update Email Option Works', async () => {
      component.form.value.website = "Update Email";
      component.submit();
      expect(component.editEmailSubmitted).toBeTruthy();
    });

    it('Update Password Option Works', async () => {
      component.form.value.website = "Update Password";
      component.submit();
      expect(component.editPasswordSubmitted).toBeTruthy();
    });
  });
});
