import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
        ],
      declarations: [ LoginComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('The /login page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    
    it('Login Button Works', () => {
      component.onSubmit();
      expect(component.loginSubmitted).toBeTruthy();
    });

    it('Form invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
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
