import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatDetailedComponent } from './list-chat-detailed.component';

describe('ListChatDetailedComponent', () => {
  let component: ListChatDetailedComponent;
  let fixture: ComponentFixture<ListChatDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListChatDetailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
