import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeStatusServiceComponent } from './dialog-change-status-service.component';

describe('DialogChangeStatusServiceComponent', () => {
  let component: DialogChangeStatusServiceComponent;
  let fixture: ComponentFixture<DialogChangeStatusServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChangeStatusServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangeStatusServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
