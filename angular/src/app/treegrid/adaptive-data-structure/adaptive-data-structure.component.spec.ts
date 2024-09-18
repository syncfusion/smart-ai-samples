import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptiveDataStructureComponent } from './adaptive-data-structure.component';

describe('AdaptiveDataStructureComponent', () => {
  let component: AdaptiveDataStructureComponent;
  let fixture: ComponentFixture<AdaptiveDataStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptiveDataStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdaptiveDataStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
