<template>
    <div id="desc-container">
        <h2 style="text-align: center;">Smart Rich Text Editor</h2>
        <div class="description-container e-card">
            <div class='e-card-content '>
                <p>The <b>Rich Text Editor</b>, enhanced with AI, offers features such as <i>content generation</i>,
                    <i>summarization</i>, <i>rephrasing</i>, <i>translation</i>, and <i>grammar correction</i>. Click
                    the <mark><b>AI Assist</b></mark> option to explore these AI-powered capabilities. Know more <a
                        href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-rich-text-editor/Readme.md">here</a>.
                </p>

            </div>
        </div>
    </div>
    <div class="control-section">
        <ejs-richtexteditor id="editor" ref="editorRef" :toolbarSettings="toolbarSettings"
            :quickToolbarSettings="quickToolbarSettings" :aiAssistantPromptRequest="onAIAssistantPromptRequest">
            <p><b>Editing and Improving</b></p>
            <p>In today's competitive landscape, effective marketing focuses on building lasting customer relationships rather than just selling products. Brands are expected to provide personalized experiences through data analytics and consumer insights. As expectations evolve, marketers must stay agile and proactive in their strategies.</p>
            <p><b>Tone and style</b></p>
            <p>Agile methodologies are essential in modern project management, particularly in software development. They enable teams to adapt quickly and deliver greater customer value through iterative processes and collaboration. Successful Agile implementation requires fostering a culture of adaptability, trust, and shared ownership.</p>
            <p><b>Grammar</b></p>
            <p>Strong leadership is more than directing a team—it's about inspiring people toward a common vision. Effective leaders cultivate transparency, empathy, and accountability within their organizations. They empower others by encouraging autonomy and providing opportunities for growth. In times of uncertainty or rapid change, it's the leaders who stay grounded and lead with clarity who build the most resilient and high-performing teams.</p>
            <p><b>Summarization, simplification, or elaboration</b></p>
            <p>Strong leadership inspires a team toward a shared vision while promoting transparency, empathy, and accountability. Effective leaders empower others through autonomy and growth. In times of uncertainty or change, clear leaders build resilient, high-performing teams.</p>
        </ejs-richtexteditor>
    </div>
</template>

<script lang="ts">
import { enableRipple } from '@syncfusion/ej2-base';
	import { defineComponent, ref, provide } from "vue";
import { AIAssistant, AIAssistantPromptRequestArgs, HtmlEditor, Image, Link, PasteCleanup, QuickToolbar,
    QuickToolbarSettingsModel, RichTextEditorComponent, Table, Toolbar, ToolbarSettingsModel , CodeBlock} from '@syncfusion/ej2-vue-richtexteditor';

enableRipple(true);

export default {
  	    name: "RichTextEditoAIAssistant",
    components: {
        ejsRichtexteditor: RichTextEditorComponent,
    },
    setup() {
        let serviceURL = 'YOUR_API_ENDPOINT';

        const richtexteditor = [AIAssistant, Toolbar, HtmlEditor, QuickToolbar, Image, Table, Link, PasteCleanup, CodeBlock];

        provide("richtexteditor", richtexteditor);

        const editorRef = ref<RichTextEditorComponent | null>(null);

        const toolbarSettings: ToolbarSettingsModel = {
            items: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', 'Formats', 'OrderedList',
                'UnorderedList', 'CheckList', 'CodeBlock', 'Blockquote', 'CreateLink', 'Image', 'CreateTable', '|', 'SourceCode', '|', 'Undo', 'Redo']
        };

        const quickToolbarSettings: QuickToolbarSettingsModel = {
            text: ['AICommands', 'AIQuery', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'FontColor', 'BackgroundColor', '|', 'UnorderedList', 'OrderedList']
        };

        let abortController: AbortController;

        async function onAIAssistantPromptRequest(args: AIAssistantPromptRequestArgs): Promise<void> {
            try {
                abortController = new AbortController();
                const response: Response = await fetch(serviceURL + '/api/stream', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                    },
                    body: JSON.stringify({ message: args.prompt + (args.text || '') }),
                    signal: abortController.signal
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP Error ${response.status}`);
                }

                const stream: ReadableStream<string> = response.body!.pipeThrough(new TextDecoderStream());
                let fullText: string = '';

                for await (const chunk of stream as unknown as AsyncIterable<string>) {
                    fullText += chunk;
                    if (editorRef.value) {
                        editorRef.value.addAIPromptResponse(fullText, false);
                    }
                }
                if (editorRef.value) {
                    editorRef.value.addAIPromptResponse(fullText, true); // Final update
                }
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('AI Request aborted by user.');
                    return;
                } else if (error.message.includes('token limit')) {
                    if (editorRef.value) {
                        editorRef.value.addAIPromptResponse(error.message, false);
                        editorRef.value.addAIPromptResponse(error.message, true);
                    }
                } else {
                    console.error('There was a problem with your fetch operation:', error);
                }
            }
        }
        return { editorRef, toolbarSettings, quickToolbarSettings, onAIAssistantPromptRequest };
    }
}

</script>
<style scoped>
#desc-container {
    padding: 10px;
    width: 98%;
}
#container {
    padding: 20px;
}

.custom-row-0,
.custom-row-1,
.custom-row-2 {
    display: flex;
    align-items: center;
    border-top: 1px solid #ddd;
    padding: 12px 24px;
}

.cuscol-0,
.cuscol-1,
.cuscol-2 {
    padding: 0.5rem;
}

.no-results-found {
    text-align: center;
}

.no-results-found img {
    display: block;
    margin: 0 auto;
}

.e-custom {
    margin-right: 0.5rem;
    border-radius: 25px !important;
}

.custom-dialog .skeleton-rectangle {
    border-radius: 4px;
}

@media (max-width: 767px) {

    .cuscol-0,
    .cuscol-1,
    .cuscol-2 {
        justify-content: center !important;
    }

    .custom-row-0,
    .custom-row-1,
    .custom-row-2 {
        flex-direction: column !important;
    }

    .cuscol-1 {
        border-right: none !important;
    }

    .cuscol-0 {
        border-right: none !important;
    }

    .custom-dialog .e-dialog .e-dlg-content {
        overflow-y: auto !important;
    }

    .custom-dialog .e-dialog .e-dlg-content .e-richtexteditor {
        height: 100px !important;
    }

    .cuscol-noresult {
        padding-bottom: 20px !important;
    }

    .e-chip-list {
        padding: 5px !important;
    }

    .cuscol {
        padding-right: 0.2rem !important;
        width: auto !important;
    }

    .custom-row-1 {
        height: auto !important;
    }
}

.cuscol-1 {
    display: flex;
    flex-direction: row !important;
}

.cuscol-2 {
    display: flex;
    flex-direction: column !important;
}

.sentiment {
    color: #000 !important;
}

.custom-dialog .e-dialog .e-dlg-content {
    padding: 0px !important;
    overflow-y: hidden;
}

.custom-dialog .e-dialog .e-dlg-header-content {
    padding: 10px !important;
    border-bottom: 1px solid #dee2e6 !important;
}

.custom-dialog .e-dialog .e-footer-content {
    padding: 0px !important;
}

.custom-dialog .e-dialog .e-dlg-content .e-richtexteditor.e-rte-tb-expand .e-rte-content,
.e-richtexteditor.e-rte-tb-expand .e-source-content {
    border: 0;
    border-bottom: 1px solid #dee2e6;
    border-top: 0px solid #dee2e6 !important;
}

.custom-dialog .dialog-content .custom-row-0 {
    border-top: 0px solid #ddd !important;
}

.e-control.e-btn {
    margin: 0 5px;
}
</style>