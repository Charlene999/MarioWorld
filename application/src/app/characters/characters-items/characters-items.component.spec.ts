import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharactersItemsComponent } from './characters-items.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

describe('CharactersItemsComponent', () => {
  let component: CharactersItemsComponent;
  let fixture: ComponentFixture<CharactersItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule
        ],
      declarations: [ CharactersItemsComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharactersItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharactersItemsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('The /profile/items page renders', () => {
    expect(component).toBeTruthy();
  });

  it('Select Dropdown Works', async () => {
    component.showItems();
    expect(component.viewSubmitted).toBeTruthy();
  });

  describe('add', () => { 
    it('ADD button works', () => {
      component.add(17);
      expect(component.addSubmitted).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('REMOVE button works', () => {
      component.remove(17);
      expect(component.removeSubmitted).toBeTruthy();
    });
  });
});
