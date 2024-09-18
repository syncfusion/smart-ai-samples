import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartMindmapComponent } from './smart-mindmap.component';

describe('SmartMindmapComponent', () => {
  let component: SmartMindmapComponent;
  let fixture: ComponentFixture<SmartMindmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartMindmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartMindmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
