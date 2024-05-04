import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastAnswerComponent } from './fast-answer.component';

describe('FastAnswerComponent', () => {
  let component: FastAnswerComponent;
  let fixture: ComponentFixture<FastAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FastAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
