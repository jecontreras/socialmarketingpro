import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenConfigTimeComponent } from './open-config-time.component';

describe('OpenConfigTimeComponent', () => {
  let component: OpenConfigTimeComponent;
  let fixture: ComponentFixture<OpenConfigTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenConfigTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenConfigTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
