import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGoogleSheetComponent } from './list-google-sheet.component';

describe('ListGoogleSheetComponent', () => {
  let component: ListGoogleSheetComponent;
  let fixture: ComponentFixture<ListGoogleSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGoogleSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGoogleSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
