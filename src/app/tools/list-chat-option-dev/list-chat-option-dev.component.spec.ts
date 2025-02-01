import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatOptionDevComponent } from './list-chat-option-dev.component';

describe('ListChatOptionDevComponent', () => {
  let component: ListChatOptionDevComponent;
  let fixture: ComponentFixture<ListChatOptionDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListChatOptionDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatOptionDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
