import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFlowsComponent } from './form-flows.component';

describe('FormFlowsComponent', () => {
  let component: FormFlowsComponent;
  let fixture: ComponentFixture<FormFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFlowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
