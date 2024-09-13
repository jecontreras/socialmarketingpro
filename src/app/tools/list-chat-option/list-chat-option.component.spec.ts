import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatOptionComponent } from './list-chat-option.component';

describe('ListChatOptionComponent', () => {
  let component: ListChatOptionComponent;
  let fixture: ComponentFixture<ListChatOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListChatOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
