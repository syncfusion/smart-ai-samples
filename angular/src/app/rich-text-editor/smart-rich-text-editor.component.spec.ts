import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartRichTextEditor } from './smart-rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: SmartRichTextEditor;
  let fixture: ComponentFixture<SmartRichTextEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartRichTextEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartRichTextEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
