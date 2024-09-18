import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveDataentryComponent } from './predictive-dataentry.component';

describe('PredictiveDataentryComponent', () => {
  let component: PredictiveDataentryComponent;
  let fixture: ComponentFixture<PredictiveDataentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictiveDataentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictiveDataentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
