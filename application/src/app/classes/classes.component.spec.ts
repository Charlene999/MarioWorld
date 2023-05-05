import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassesComponent } from './classes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let fixture: ComponentFixture<ClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ ClassesComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /classes page renders', () => {
    expect(component).toBeTruthy();
  });

  it('Sorcerer Button Works', async () => {
    component.submit(1);
    expect(component.firstButtonClicked).toBeTruthy();
  });

  it('Barbarian Button Works', async () => {
    component.submit(2);
    expect(component.secondButtonClicked).toBeTruthy();
  });

  it('Bard Button Works', async () => {
    component.submit(3);
    expect(component.thirdButtonClicked).toBeTruthy();
  });

  it('Druid Button Works', async () => {
    component.submit(4);
    expect(component.fourthButtonClicked).toBeTruthy();
  });

  it('Shaman Button Works', async () => {
    component.submit(5);
    expect(component.fifthButtonClicked).toBeTruthy();
  });

  it('Hunter Button Works', async () => {
    component.submit(6);
    expect(component.sixthButtonClicked).toBeTruthy();
  });

  it('Necromancer Button Works', async () => {
    component.submit(7);
    expect(component.seventhButtonClicked).toBeTruthy();
  });

  it('Rogue Button Works', async () => {
    component.submit(8);
    expect(component.eighthButtonClicked).toBeTruthy();
  });

  it('Paladin Button Works', async () => {
    component.submit(9);
    expect(component.ninthButtonClicked).toBeTruthy();
  });

  it('Priest Button Works', async () => {
    component.submit(10);
    expect(component.tenthButtonClicked).toBeTruthy();
  });
  
});
