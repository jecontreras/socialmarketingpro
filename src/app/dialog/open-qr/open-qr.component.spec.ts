import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenQrComponent } from './open-qr.component';

describe('OpenQrComponent', () => {
  let component: OpenQrComponent;
  let fixture: ComponentFixture<OpenQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
