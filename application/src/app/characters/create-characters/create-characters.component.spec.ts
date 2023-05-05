import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCharactersComponent } from './create-characters.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('CreateCharactersComponent', () => {
  let component: CreateCharactersComponent;
  let fixture: ComponentFixture<CreateCharactersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ CreateCharactersComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /profile/create-character page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {

    it('Submit Button Works', async () => {
      const testForm = <NgForm>{
        value: {
          name: "d",
          description: "d",
          level: 1
        }
      };
      component.onSubmit(testForm);
      expect(component.createSubmitted).toBeTruthy();
    });
    
    it('User Input is Received', async () => {
      const testForm = <NgForm>{
        value: {
          name: "d",
          description: "d",
          level: 1
        }
      };
      component.onSubmit(testForm);
      expect(testForm.value.name).toMatch('d');
      expect(testForm.value.description).toMatch('d');
      expect(testForm.value.level).toEqual(1);
    });
  });
});
