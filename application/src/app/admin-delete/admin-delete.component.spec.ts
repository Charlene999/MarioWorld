import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDeleteComponent } from './admin-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('AdminDeleteComponent', () => {
  let component: AdminDeleteComponent;
  let fixture: ComponentFixture<AdminDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
        ],
      declarations: [ AdminDeleteComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /admin/delete-spells-and-items page renders', () => {
    expect(component).toBeTruthy();
  });

  //Describe is the function name being tested
  describe('viewItems', () => {
    it('View Items Button Works', async () => {
      component.viewItems();
      expect(component.viewItemsSubmitted).toBeTruthy();
    });
  });

  //Describe is the function name being tested
  describe('deleteItem', () => {
    it('Delete Item Button Works', async () => {
      const id = 1;
      const name = 'd';
      component.deleteItem(id, name);
      expect(component.deleteItemSubmitted).toBeTruthy();
    });
  });

});
