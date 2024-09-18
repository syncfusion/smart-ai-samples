import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPasteComponent } from './smart-paste.component';

describe('SmartPasteComponent', () => {
  let component: SmartPasteComponent;
  let fixture: ComponentFixture<SmartPasteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartPasteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartPasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
