import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerifyEmailComponent } from './dialog-verify-email.component';

describe('DialogVerifyEmailComponent', () => {
  let component: DialogVerifyEmailComponent;
  let fixture: ComponentFixture<DialogVerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVerifyEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
