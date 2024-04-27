import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAllChatComponent } from './form-all-chat.component';

describe('FormAllChatComponent', () => {
  let component: FormAllChatComponent;
  let fixture: ComponentFixture<FormAllChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAllChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAllChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
