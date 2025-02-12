import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuyComponent } from './create-buy.component';

describe('CreateBuyComponent', () => {
  let component: CreateBuyComponent;
  let fixture: ComponentFixture<CreateBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
