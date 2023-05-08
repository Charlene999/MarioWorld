import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnoGamePlayComponent } from './uno-game-play.component';

describe('UnoGamePlayComponent', () => {
  let component: UnoGamePlayComponent;
  let fixture: ComponentFixture<UnoGamePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnoGamePlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnoGamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
