import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherPredictionComponent } from './weather-prediction.component';

describe('WeatherPredictionComponent', () => {
  let component: WeatherPredictionComponent;
  let fixture: ComponentFixture<WeatherPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherPredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
