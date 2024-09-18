import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceOptimizationComponent } from './resource-optimization.component';

describe('ResourceOptimizationComponent', () => {
  let component: ResourceOptimizationComponent;
  let fixture: ComponentFixture<ResourceOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceOptimizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
