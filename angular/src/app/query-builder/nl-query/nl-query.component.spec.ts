import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NlQueryComponent } from './nl-query.component';

describe('NlQueryComponent', () => {
  let component: NlQueryComponent;
  let fixture: ComponentFixture<NlQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NlQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NlQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
