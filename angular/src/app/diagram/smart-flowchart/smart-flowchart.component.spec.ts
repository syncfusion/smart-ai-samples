import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFlowchartComponent } from './smart-flowchart.component';

describe('SmartFlowchartComponent', () => {
  let component: SmartFlowchartComponent;
  let fixture: ComponentFixture<SmartFlowchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFlowchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartFlowchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
