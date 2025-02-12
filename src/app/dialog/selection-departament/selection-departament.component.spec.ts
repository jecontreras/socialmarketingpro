import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionDepartamentComponent } from './selection-departament.component';

describe('SelectionDepartamentComponent', () => {
  let component: SelectionDepartamentComponent;
  let fixture: ComponentFixture<SelectionDepartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionDepartamentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionDepartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
