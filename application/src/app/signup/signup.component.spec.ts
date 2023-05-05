import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
        ],
      declarations: [ SignupComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('The /signup page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    
    it('Submit Button Works', () => {
      component.onSubmit();
      expect(component.signUpSubmitted).toBeTruthy();
    });

    it('Form invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('Name field validity', () => {
      let name = component.form.controls['name'];
      expect(name.valid).toBeFalsy();

      name.setValue("");
      expect(name.hasError('required')).toBeTruthy();

      name.setValue("M");
      expect(name.hasError('minlength')).toBeTruthy();

      name.setValue("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
      expect(name.hasError('maxlength')).toBeTruthy();
    });

    it('Username field validity', () => {
      let username = component.form.controls['username'];
      expect(username.valid).toBeFalsy();

      username.setValue("");
      expect(username.hasError('required')).toBeTruthy();

      username.setValue("M");
      expect(username.hasError('minlength')).toBeTruthy();

      username.setValue("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
      expect(username.hasError('maxlength')).toBeTruthy();
    });

    it('Email field validity', () => {
      let email = component.form.controls['email'];
      expect(email.valid).toBeFalsy();

      email.setValue("");
      expect(email.hasError('required')).toBeTruthy();

      email.setValue("A");
      expect(email.hasError('email')).toBeTruthy();

    });

    it('Password field validity', () => {
      let password = component.form.controls['password'];
      expect(password.valid).toBeFalsy();

      password.setValue("");
      expect(password.hasError('required')).toBeTruthy();

      password.setValue("M");
      expect(password.hasError('minlength')).toBeTruthy();

      password.setValue("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
      expect(password.hasError('maxlength')).toBeTruthy();
    });
  });
});
