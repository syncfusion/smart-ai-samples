import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTrendAnalysisComponent } from './data-trend-analysis.component';

describe('DataTrendAnalysisComponent', () => {
  let component: DataTrendAnalysisComponent;
  let fixture: ComponentFixture<DataTrendAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTrendAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTrendAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
