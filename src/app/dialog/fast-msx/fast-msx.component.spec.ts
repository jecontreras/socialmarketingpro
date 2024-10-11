import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastMsxComponent } from './fast-msx.component';

describe('FastMsxComponent', () => {
  let component: FastMsxComponent;
  let fixture: ComponentFixture<FastMsxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastMsxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastMsxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
