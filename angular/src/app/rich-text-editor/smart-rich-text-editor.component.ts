import { Component, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { AIAssistantPromptRequestArgs, AIAssistantService, HtmlEditorService, ImageService, LinkService, PasteCleanupService, QuickToolbarService, QuickToolbarSettingsModel, RichTextEditorComponent, RichTextEditorModule, TableService, ToolbarService, ToolbarSettingsModel, CodeBlockService } from "@syncfusion/ej2-angular-richtexteditor";
import { enableRipple } from "@syncfusion/ej2/base";
enableRipple(true);

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [RichTextEditorModule],
  providers: [AIAssistantService, HtmlEditorService, ToolbarService, QuickToolbarService, ImageService, TableService, LinkService, PasteCleanupService, CodeBlockService],
  templateUrl: './smart-rich-text-editor.component.html',
  styleUrl: './smart-rich-text-editor.component.css'
})
export class SmartRichTextEditor {
  @ViewChild('editor')
  private serviceURL = 'YOUR_API_ENDPOINT';

  public editor: RichTextEditorComponent | undefined;


  public abortController: AbortController | undefined;

  public toolbarSettings: ToolbarSettingsModel = {
    items: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', 'Formats', 'OrderedList',
      'UnorderedList', 'CheckList', 'CodeBlock', 'Blockquote', 'CreateLink', 'Image', 'CreateTable', '|', 'SourceCode', '|', 'Undo', 'Redo']
  };

  public quickToolbarSettings: QuickToolbarSettingsModel = {
    text: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'Fontcolor', 'BackgroundColor', '|', 'Unorderedlist', 'Orderedlist']
  }

  async onAIAssistantPromptRequest(args: AIAssistantPromptRequestArgs): Promise<void> {
    try {
      this.abortController = new AbortController();
      const response: Response = await fetch(this.serviceURL + '/api/stream', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({ message: args.prompt + (args.text) }),
        signal: this.abortController.signal
      });
      if (!response.ok) {
        const errorData = await response.json(); // read the JSON body
        throw new Error(errorData.error || `HTTP Error ${response.status}`);
      }
      const body = response.body;
      if (!body) {
        throw new Error('Response body is null');
      }
      const stream: ReadableStream<string> = body.pipeThrough(new TextDecoderStream()); let fullText: string = '';
      for await (const chunk of stream as unknown as AsyncIterable<string>) {
        fullText += chunk;
        this.editor!.addAIPromptResponse(fullText, false);
      }
      this.editor!.addAIPromptResponse(fullText, true); // Final update
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const name = error instanceof Error ? error.name : String(error);
      if (name === 'AbortError') {
        console.log('AI Request aborted by user.');
        return;
      } else if (message.includes('token limit')) {
        this.editor!.addAIPromptResponse(message, false);
        this.editor!.addAIPromptResponse(message, true);
        const bannerEl = document.querySelector('.banner-message');
        const headerEl = document.querySelector('.sb-token-header');
        if (bannerEl) {
          bannerEl.textContent = message; // prefer textContent over innerHTML for safety
        }
        if (headerEl) {
          headerEl.classList.remove('sb-hide');
        }
      } else {
        console.error('There was a problem with your fetch operation:', error);
      }
    }
  }
}
