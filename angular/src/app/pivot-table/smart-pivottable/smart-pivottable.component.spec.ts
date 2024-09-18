import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartPivottableComponent } from './smart-pivottable.component';

describe('SmartPivottableComponent', () => {
  let component: SmartPivottableComponent;
  let fixture: ComponentFixture<SmartPivottableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartPivottableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartPivottableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
