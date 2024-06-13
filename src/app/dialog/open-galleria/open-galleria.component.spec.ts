import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGalleriaComponent } from './open-galleria.component';

describe('OpenGalleriaComponent', () => {
  let component: OpenGalleriaComponent;
  let fixture: ComponentFixture<OpenGalleriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenGalleriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGalleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
