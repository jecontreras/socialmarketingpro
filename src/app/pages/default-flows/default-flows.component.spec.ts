import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFlowsComponent } from './default-flows.component';

describe('DefaultFlowsComponent', () => {
  let component: DefaultFlowsComponent;
  let fixture: ComponentFixture<DefaultFlowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultFlowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFlowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
