import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAnalysisComponent } from './risk-analysis.component';

describe('RiskAnalysisComponent', () => {
  let component: RiskAnalysisComponent;
  let fixture: ComponentFixture<RiskAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
