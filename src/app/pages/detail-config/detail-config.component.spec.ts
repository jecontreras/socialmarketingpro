import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConfigComponent } from './detail-config.component';

describe('DetailConfigComponent', () => {
  let component: DetailConfigComponent;
  let fixture: ComponentFixture<DetailConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
