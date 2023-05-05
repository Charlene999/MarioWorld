import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EmailComponent } from './email.component';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
      HttpClientModule, 
      HttpClientTestingModule,
      ReactiveFormsModule,
      FormsModule
      ],
    declarations: [ EmailComponent ],
    providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /profile/email page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    
    it('Submit Button Works', () => {
      component.onSubmit();
      expect(component.emailSubmitted).toBeTruthy();
    });

    it('Form invalid when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('Email field validity', () => {
      let email = component.form.controls['email'];
      expect(email.valid).toBeFalsy();

      email.setValue("");
      expect(email.hasError('required')).toBeTruthy();

      email.setValue("A");
      expect(email.hasError('email')).toBeTruthy();
    });

  });
});
