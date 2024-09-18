import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalEmbeddingComponent } from './local-embedding.component';

describe('LocalEmbeddingComponent', () => {
  let component: LocalEmbeddingComponent;
  let fixture: ComponentFixture<LocalEmbeddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalEmbeddingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalEmbeddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
