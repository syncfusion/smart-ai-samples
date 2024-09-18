import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartEditorComponent } from './smart-editor.component';

describe('SmartEditorComponent', () => {
  let component: SmartEditorComponent;
  let fixture: ComponentFixture<SmartEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
