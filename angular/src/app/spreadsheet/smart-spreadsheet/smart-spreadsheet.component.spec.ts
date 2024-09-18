import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartSpreadsheetComponent } from './smart-spreadsheet.component';

describe('SmartSpreadsheetComponent', () => {
  let component: SmartSpreadsheetComponent;
  let fixture: ComponentFixture<SmartSpreadsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSpreadsheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartSpreadsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
