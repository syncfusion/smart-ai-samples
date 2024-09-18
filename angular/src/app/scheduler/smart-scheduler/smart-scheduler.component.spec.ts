import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartSchedulerComponent } from './smart-scheduler.component';

describe('SmartSchedulerComponent', () => {
  let component: SmartSchedulerComponent;
  let fixture: ComponentFixture<SmartSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
