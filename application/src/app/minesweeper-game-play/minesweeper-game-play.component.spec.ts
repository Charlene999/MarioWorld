import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinesweeperGamePlayComponent } from './minesweeper-game-play.component';

describe('MinesweeperGamePlayComponent', () => {
  let component: MinesweeperGamePlayComponent;
  let fixture: ComponentFixture<MinesweeperGamePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinesweeperGamePlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinesweeperGamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
