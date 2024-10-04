import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatNewDetailedComponent } from './chat-new-detailed.component';

describe('ChatNewDetailedComponent', () => {
  let component: ChatNewDetailedComponent;
  let fixture: ComponentFixture<ChatNewDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatNewDetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatNewDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
