import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PasswordComponent } from './password.component';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ PasswordComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /profile/pass page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('Submit Button Works', () => {
      component.onSubmit();
      expect(component.passwordSubmitted).toBeTruthy();
    });

    it('Form invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
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
