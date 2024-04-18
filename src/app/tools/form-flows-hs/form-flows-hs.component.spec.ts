import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFlowsHsComponent } from './form-flows-hs.component';

describe('FormFlowsHsComponent', () => {
  let component: FormFlowsHsComponent;
  let fixture: ComponentFixture<FormFlowsHsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFlowsHsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFlowsHsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
