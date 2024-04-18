import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasBlocksComponent } from './canvas-blocks.component';

describe('CanvasBlocksComponent', () => {
  let component: CanvasBlocksComponent;
  let fixture: ComponentFixture<CanvasBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasBlocksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
