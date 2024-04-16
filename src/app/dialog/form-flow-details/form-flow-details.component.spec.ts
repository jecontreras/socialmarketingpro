import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFlowDetailsComponent } from './form-flow-details.component';

describe('FormFlowDetailsComponent', () => {
  let component: FormFlowDetailsComponent;
  let fixture: ComponentFixture<FormFlowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFlowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFlowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
