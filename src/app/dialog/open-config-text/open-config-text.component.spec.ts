import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenConfigTextComponent } from './open-config-text.component';

describe('OpenConfigTextComponent', () => {
  let component: OpenConfigTextComponent;
  let fixture: ComponentFixture<OpenConfigTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenConfigTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenConfigTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
