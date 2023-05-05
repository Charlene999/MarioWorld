import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('Login Button Works', async () => {
      component.login();
      expect(component.loginSubmitted).toBeTruthy();
    });
  });

  describe('signup', () => {
    it('Sign Up Button Works', async () => {
      component.signup();
      expect(component.signupSubmitted).toBeTruthy();
    });
  });
});
