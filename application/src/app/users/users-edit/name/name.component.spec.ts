import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NameComponent } from './name.component';

describe('NameComponent', () => {
  let component: NameComponent;
  let fixture: ComponentFixture<NameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ NameComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /profile/name page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('Submit Button Works', () => {
      component.onSubmit();
      expect(component.nameSubmitted).toBeTruthy();
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

      //Add additional username validity test cases for pattern
    });
  });
});
