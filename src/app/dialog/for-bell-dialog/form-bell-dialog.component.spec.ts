import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBellDialogComponent } from './form-bell-dialog.component';

describe('ForBellDialogComponent', () => {
  let component: FormBellDialogComponent;
  let fixture: ComponentFixture<FormBellDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBellDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBellDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
