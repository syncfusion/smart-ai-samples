/**
 * Rich Text Editor AI Assistant sample
 */
import { AIAssistant, AIAssistantPromptRequestArgs, HtmlEditor, Image, Link, PasteCleanup, QuickToolbar, RichTextEditor, Table, Toolbar, CodeBlock } from '@syncfusion/ej2-richtexteditor';

RichTextEditor.Inject(AIAssistant, HtmlEditor, Toolbar, QuickToolbar, Image, Table, Link, PasteCleanup, CodeBlock);
    let STREAM_LINK = 'https://ai-samples-server-f5hta2h9g5aqhcfg.southindia-01.azurewebsites.net';
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
            try {
                abortController = new AbortController();
                const response: Response = await fetch(STREAM_LINK + '/api/stream', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({ message: args.prompt + (args.text) }),
                    signal: abortController.signal
                });
                if (!response.ok) {
                    const errorData = await response.json(); // read the JSON body
                    throw new Error(errorData.error || `HTTP Error ${response.status}`);
                }
                const body = response.body;
                if (!body) {
                    throw new Error('Response body is null');
                }
                const stream: ReadableStream<string> = body.pipeThrough(new TextDecoderStream());
                let fullText: string = '';
                for await (const chunk of stream as unknown as AsyncIterable<string>) {
                    fullText += chunk;
                    editor.addAIPromptResponse(fullText, false);
                }
                editor.addAIPromptResponse(fullText, true); // Final update
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                const name = error instanceof Error ? error.name : String(error);
                if (message.includes('token limit')) {
                    if (name === 'AbortError') {
                        console.log('AI Request aborted by user.');
                        return;
                    } else if (message.includes('token limit')) {
                        editor.addAIPromptResponse(message, true);

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
        },
        aiAssistantStopRespondingClick: () => {
            abortController.abort();
        }
    })
    editor.appendTo('#editor');
