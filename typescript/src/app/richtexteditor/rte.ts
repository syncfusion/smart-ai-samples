
import { enableRipple } from '@syncfusion/ej2-base';
import { getAzureChatAIRequest } from '../ai-models';
import { RichTextEditor, Toolbar, Link, NodeSelection, Image, QuickToolbar, HtmlEditor,ToolbarClickEventArgs } from '@syncfusion/ej2-richtexteditor';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Skeleton, Toast } from '@syncfusion/ej2-notifications';
import { Button, ChipList } from '@syncfusion/ej2-buttons';
import { DropDownButton } from '@syncfusion/ej2/splitbuttons';

RichTextEditor.Inject(Toolbar, Link, Image, QuickToolbar, HtmlEditor);
let dialog: Dialog;

const queryList: { ID: string; Text: string }[] = [
  {ID : "Rephrase", Text : "Rephrase"},
  {ID : "Grammar", Text : "Correct Grammar" },
  {ID : "Summarize", Text : "Summarize" },
  {ID : "Elaborate", Text : "Elaborate"},
  {ID : "Translate", Text : "Translate"},
  {ID : "SentimentAnalysis", Text : "Sentiment Analysis"}
];

const languageList: { ID: string; Text: string }[]  = [
  { ID: "EN", Text: "English" },
  { ID: "ZH", Text: "Chinese (Simplified)" },
  { ID: "ZHT", Text: "Chinese (Traditional)" },
  { ID: "ES", Text: "Spanish" },
  { ID: "HI", Text: "Hindi" },
  { ID: "AR", Text: "Arabic" },
  { ID: "BN", Text: "Bengali" },
  { ID: "PT", Text: "Portuguese" },
  { ID: "RU", Text: "Russian" },
  { ID: "JA", Text: "Japanese" },
  { ID: "DE", Text: "German" },
  { ID: "KO", Text: "Korean" },
  { ID: "FR", Text: "French" },
  { ID: "IT", Text: "Italian" },
  { ID: "TR", Text: "Turkish" }
];

let subQuery = '';
let promptQuery = '';
let isSentimentCheck: boolean = false;
let resultData: string = '';
let leftRte: RichTextEditor;
let rightRte: RichTextEditor;
let aiassistantButton: DropDownButton;
let dropValIndex = 0;
let queryCategory: DropDownList;
let isDialogElementCreated: boolean = false;
let regenerateButton: Button;
let copyButton: Button;
let replaceButton: Button;
let sentimentButton: Button
let apiResultData: any;
let AIResult: string;
let toastObj: Toast;
let chipList: ChipList;
let languageCategory: DropDownList;
let translatelanguage: string;
let chipValue: string[] = ['Standard'];


let defaultRTE: RichTextEditor = new RichTextEditor({
  height: 550,
  saveInterval: 0,
  autoSaveOnIdle: true,
  value: `<h5><span>Integrate AI with the Editor</span></h5><p>Integrate the AI assist into the rich text editor by capturing the content from the editor, sending it to the AI service, and displaying the results or suggestions back in the editor.</p><h6>Summarize</h6><p>This function condenses the selected content into a brief summary, capturing the main points succinctly.</p><h6>Elaborate</h6><p>This function expands the selected content, adding additional details and context.</p><h6>Rephrase</h6><p>This function rewrites the selected content to convey the same meaning using different words or structures. It also enables rephrase options and disables language selection.</p><h6>Correct Grammar</h6><p>This function reviews and corrects the grammar of the selected content, ensuring it adheres to standard grammatical rules.</p><h6>Translate</h6><p>This function translates the selected content into the specified language, enabling language selection and disabling rephrase options.</p>`,
  toolbarSettings: {
    items: [
      {
        tooltipText: 'AI Assist',
        template:
          '<button class="e-tbar-btn e-btn" tabindex="-1" id="ai_assistant_button_tbar" style="width:100%"><div class="e-rte-dropdown-btn-text"> AI Assist</div></button>'
      },
      'Bold',
      'Italic',
      'Underline',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      '|',
      'BackgroundColor',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'BulletFormatList',
      'CreateLink',
      'Image',
      '|',
      'createTable',
      'SourceCode',
      'Undo',
      'Redo',
    ],
  },
  created: onCreate,
  toolbarClick: onToolbarClick
});
defaultRTE.appendTo('#defaultRTE');

function aiQuerySelectedMenu(args: any): void {
  dialogueOpen(args.item.text);
}

function onToolbarClick(args: ToolbarClickEventArgs): void {
  if (args.item.tooltipText === 'Rephrase') {
     dialogueOpen("Rephrase");
  }
}

function dialogueOpen(selectedQuery: string): void {
  var selectionText = defaultRTE.getSelectedHtml();
  if (selectionText){
    let range: Range = (defaultRTE as any).formatter.editorManager.nodeSelection?.getRange((defaultRTE as any).contentModule.getDocument());
    (defaultRTE as any).formatter.editorManager.nodeSelection?.save(range, (defaultRTE as any).contentModule.getDocument());
    dropValIndex = queryList.findIndex(q => q.Text.toLowerCase() === selectedQuery.toLowerCase());
    queryCategory.index = dropValIndex;
    leftRte.value = promptQuery = selectionText;
    leftRte.refreshUI();
    dialog.show();
    updateAISugesstionsData(selectedQuery);
  } else {
    if (!toastObj){
      toastObj = new Toast({
        showCloseButton: true,
        timeOut: 2000,
        content: 'Please select the content to perform the AI operation.',
        position: { X: 'Right', Y: 'Top' }
      });
      toastObj.appendTo('#toast_default');
    }
    toastObj.show();
  }
}

function updateAISugesstionsData(selectedQuery: string): void {
  (document.getElementById('language') as HTMLElement).style.display = 'none';
  (document.getElementById('chips-container') as HTMLElement).style.display = 'none';
  isSentimentCheck = false;
  switch (selectedQuery)
  {
    case "Summarize":
        subQuery = "Summarize the upcoming sentence shortly.";
        break;
    case "Elaborate":
        subQuery = "Elaborate on the upcoming sentence.";
        break;
    case "Rephrase":
       (document.getElementById('chips-container') as HTMLElement).style.display = '';
        subQuery = chipValue[0] + " rephrase the upcoming sentence.";
        break;
    case "Correct Grammar":
        subQuery = "Correct the grammar of the upcoming sentence.";
        break;
    case "Translate":
      (document.getElementById('language') as HTMLElement).style.display = '';
       subQuery = "Translate the upcoming sentence to " + translatelanguage +".";
        break;
    case "Sentiment Analysis":
        isSentimentCheck = true;
        subQuery = "Analyze the sentiment and grammar of the following paragraphs and provide the expression score with an emoji followed by the sentiment in the format: \"😊 Neutral\". \n\nNOTE: Avoid any additional text or explanation:";
        break;
  }
  updateAISugesstions();
}

function updateAISugesstions(): void
{
  try
  {
    if (promptQuery)
    {
      (document.getElementById('skeletonId') as HTMLElement).style.display = '';
      (document.getElementById('rightRte') as HTMLElement).style.display = 'none';
      sentimentButton.element.style.display = 'none';
      regenerateButton.disabled = true;
      copyButton.disabled = true;
      replaceButton.disabled = true;
      apiResultData = getResponseFromOpenAI(subQuery, promptQuery);
      apiResultData.then((result: any) => {
        AIResult = isSentimentCheck ? promptQuery : result;
        sentimentButton.content = result.toLowerCase().includes("positive") ? "😊 Positive" : result.toLowerCase().includes("negative") ? "😞 Negative" : "😐 Neutral";
        sentimentButton.element.style.display = !isSentimentCheck ? 'none' : '';
        rightRte.value = AIResult;
        var noResultsFound = !(AIResult || promptQuery);
        (document.getElementById('no-results-found') as HTMLElement).style.display = noResultsFound ? '' : 'none';
        regenerateButton.disabled = noResultsFound;
        copyButton.disabled = noResultsFound;
        replaceButton.disabled = noResultsFound;
        (document.getElementById('skeletonId') as HTMLElement).style.display = 'none';
        (document.getElementById('rightRte') as HTMLElement).style.display = noResultsFound ? 'none' : '';
      });
    }
  } catch {
    if (!toastObj){
      toastObj = new Toast({
        showCloseButton: true,
        timeOut: 0,
        content: 'An error occurred during the AI process, Please try again.',
        position: { X: 'Right', Y: 'Top' }
      });
      toastObj.appendTo('#toast_default');
    }
    toastObj.show();
  }
}

async function getResponseFromOpenAI(subQuery: string, promptQuery: string): Promise<string> {
  const content = await getAzureChatAIRequest({messages:
    [
        { role: "system", content: subQuery.includes("emoji followed by the sentiment in the format") ? "You are a helpful assistant. Please respond in string format." : "NOTE: Return same html format just do changes content only. don't change html formats."},
        { 
            role: "user", 
            content: `${subQuery} ${promptQuery}`
        }
    ]});
  return content ? content as string : '';
}

function onCreate(): void {
  if (!aiassistantButton){
    aiassistantButton = new DropDownButton({
      items: [
        { text: 'Rephrase' },
        { text: 'Correct Grammar' },
        { text: 'Summarize' },
        { text: 'Elaborate' },
        { text: 'Translate' },
       
      ],
      iconCss:'e-btn-icon e-icons e-assist-chat e-icon-left',
      cssClass: 'menubutton e-tbar-btn e-tbar-btn-text',
      select: aiQuerySelectedMenu
    });
    aiassistantButton.appendTo('#ai_assistant_button_tbar');
  }

  if (!dialog){
    createDialog();
  }
}

function createDialog (): void {
  let dialogCtn: HTMLElement = document.getElementById('dialog-content') as HTMLElement;
  let dialogFooter: HTMLElement = document.getElementById('dialog-footer-content') as HTMLElement;
  dialog = new Dialog({
    header: 'AI Assist',
    content: dialogCtn,
    target: document.getElementById('defaultRTE') as HTMLElement,
    showCloseIcon: true,
    isModal: true,
    height: '100%',
    width: '80%',
    cssClass: 'e-rte-elements custom-dialog',
    zIndex: 1000,
    footerTemplate: dialogFooter,
    close: closeDialog,
    overlayClick: (): void => {
      let activeEle: HTMLElement = dialog.element.querySelector('.char_block.e-active') as HTMLElement;
      if (activeEle) {
        activeEle.classList.remove('e-active');
      }
      closeDialog();
    }
  });
  dialog.appendTo('#dialog');
  dialog.hide();
  dialog.open = dialogShow;
}

function dialogShow(): void {
  if (!isDialogElementCreated){
    chipList = new ChipList({  chips: ['Standard','Fluent','Professional'], selection: 'Single', cssClass: 'e-outline',
    selectedChips: [0]}, '#chips-container');
    chipList.click = (args: any) => {
      chipValue[0] = args.text;
      updateAISugesstionsData("Rephrase");
    }
    queryCategory = new DropDownList({
      index: 0,
      dataSource: queryList,
      fields: { text: 'Text', value: 'ID' },
      cssClass: 'e-e-round-corner',
      select: (args: any) => {
        chipList.selectedChips = 0;
        languageCategory.index = 0;
        translatelanguage = "EN";
        updateAISugesstionsData(args.itemData.Text);
      }
    });
    queryCategory.appendTo('#queryCategory');
    languageCategory= new DropDownList({
      index: 0,
      dataSource: languageList,
      fields: { text: 'Text', value: 'ID' },
      cssClass: 'e-e-round-corner',
      select: (args: any) => {
        translatelanguage = args.itemData.ID;
        updateAISugesstionsData("Translate");
      }
    });
    leftRte = new RichTextEditor({
      height: 310,
      value: resultData,
      toolbarSettings: {
        enable: false,
      },
      placeholder: 'Analysis of AI Support',
      width: '100%',
      cssClass: 'e-outline',
    });
    leftRte.appendTo('#leftRte');
    rightRte = new RichTextEditor({
      height: 310,
      value: resultData,
      toolbarSettings: {
        enable: false,
      },
      placeholder: 'Analysis of AI Support',
      width: '100%',
      cssClass: 'e-outline',
    });
    rightRte.appendTo('#rightRte');
    let skeletonId1: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "100%"
    });
    skeletonId1.appendTo("#skeletonId1");
    let skeletonId2: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "90%"
    });
    skeletonId2.appendTo("#skeletonId2");
    let skeletonId3: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "70%"
    });
    skeletonId3.appendTo("#skeletonId3");
    let skeletonId4: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "50%"
    });
    skeletonId4.appendTo("#skeletonId4");
    let skeletonId5: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "30%"
    });
    skeletonId5.appendTo("#skeletonId5");
    let skeletonId6: Skeleton = new Skeleton({
      shape: 'Rectangle',
      height: "20px",
      width: "10%"
    });
    skeletonId6.appendTo("#skeletonId6");
    languageCategory.appendTo('#language-Category');
    regenerateButton = new Button({
      content: 'Regenerate',
      isPrimary: true,
      disabled: true
    });
    regenerateButton.appendTo('#regenerate');
    regenerateButton.element.onclick = (): void => {
      updateAISugesstions();
    };
    sentimentButton = new Button({
      content: '😊 Neutral',
      disabled: true,
      cssClass: 'sentiment'
    });
    sentimentButton.appendTo('#sentiment');
    copyButton = new Button({
      content: 'Copy',
      disabled: true,
    });
    copyButton.appendTo('#copy');
    copyButton.element.onclick = (): void => {
      copyTextToClipboard(AIResult);
    };
    replaceButton = new Button({
      content: 'Replace',
      isPrimary: true,
      disabled: true
    });
    replaceButton.appendTo('#replace');
    replaceButton.element.onclick = (): void => {
      let range: Range = (defaultRTE as any).formatter.editorManager.nodeSelection?.getRange((defaultRTE as any).contentModule.getDocument());
      (defaultRTE as any).formatter.editorManager.nodeSelection?.restore(range);
      (defaultRTE as any).executeCommand('insertHTML', AIResult, { undo: true });
      closeDialog();
    };
    isDialogElementCreated = true;
    (dialog as Dialog).element.style.display = '';
  }
}

function closeDialog(): void {
  dialog.hide();
  rightRte.value = '';
  leftRte.value = '';
  promptQuery = '';
  chipValue[0] = 'Standard';
  AIResult = '';
  dropValIndex = 0;
  (document.getElementById('chips-container') as HTMLElement).style.display = '';
  (document.getElementById('language') as HTMLElement).style.display = 'none';
  sentimentButton.content = '😊 Neutral';
}

function copyTextToClipboard(text: string): void {
  if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
          console.log('Text copied to clipboard successfully!');
      }).catch(err => {
          console.error('Failed to copy text: ', err);
      });
  } else {
      // Fallback for browsers that do not support the Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
          document.execCommand('copy');
          console.log('Text copied to clipboard using execCommand');
      } catch (err) {
          console.error('Failed to copy text: ', err);
      } finally {
          document.body.removeChild(textarea);
      }
  }
}