/**
 * Rich Text Editor AI Assistant sample
 */
import { AIAssistant, AIAssistantPromptRequestArgs, HtmlEditor, Image, Link, PasteCleanup, QuickToolbar, RichTextEditor, Table, Toolbar, CodeBlock } from '@syncfusion/ej2-richtexteditor';
import { getUserID, AI_SERVICE_URL } from './ai-service';

RichTextEditor.Inject(AIAssistant, HtmlEditor, Toolbar, QuickToolbar, Image, Table, Link, PasteCleanup, CodeBlock);

this.default = (): void => {
    let abortController: AbortController;
    let userID: string;
    const editor: RichTextEditor = new RichTextEditor({
        toolbarSettings: {
            items: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', 'Formats', 'OrderedList',
                'UnorderedList', 'CheckList', 'CodeBlock', 'Blockquote', 'CreateLink', 'Image', 'CreateTable', '|', 'SourceCode', '|', 'Undo', 'Redo']
        },
        quickToolbarSettings: {
            text: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'Fontcolor', 'BackgroundColor', '|', 'Unorderedlist', 'Orderedlist']
        },
        aiAssistantPromptRequest: async (args: AIAssistantPromptRequestArgs) => {
            userID = await getUserID();
            try {
                abortController = new AbortController();
                const response: Response = await fetch(AI_SERVICE_URL + '/api/stream', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": userID
                    },
                    body: JSON.stringify({ message: args.prompt + (args.text) }),
                    signal: abortController.signal
                });
                if (!response.ok) {
                    const errorData = await response.json(); // read the JSON body
                    throw new Error(errorData.error || `HTTP Error ${response.status}`);
                }
                const stream: ReadableStream<string> = response.body.pipeThrough(new TextDecoderStream());
                let fullText: string = '';
                for await (const chunk of stream as unknown as AsyncIterable<string>) {
                    fullText += chunk;
                    editor.addAIPromptResponse(fullText, false);
                }
                editor.addAIPromptResponse(fullText, true); // Final update
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('AI Request aborted by user.');
                    return;
                } else if (error.message.includes('token limit')) {
                    editor.addAIPromptResponse(error.message, true);
                    document.querySelector('.banner-message').innerHTML = error.message;
                    document.querySelector('.sb-header1').classList.remove('sb-hide');
                } else {
                    console.error('There was a problem with your fetch operation:', error);
                }
            }
        },
        aiAssistantStopRespondingClick: () => {
            abortController.abort();
        }
    })
    editor.appendTo('#editor');
}