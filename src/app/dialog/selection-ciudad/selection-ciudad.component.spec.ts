import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionCiudadComponent } from './selection-ciudad.component';

describe('SelectionCiudadComponent', () => {
  let component: SelectionCiudadComponent;
  let fixture: ComponentFixture<SelectionCiudadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionCiudadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionCiudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
