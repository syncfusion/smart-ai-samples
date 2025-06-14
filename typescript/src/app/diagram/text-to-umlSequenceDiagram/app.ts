
/**
 * Default Uml Sequence Diagram sample
 */
import { Button, Fab } from '@syncfusion/ej2/buttons';
import { Diagram, SnapConstraints, NodeModel, UmlSequenceParticipant, UmlSequenceFragment, DiagramTools, FileFormats, IExportOptions, IScrollChangeEventArgs, PrintAndExport } from '@syncfusion/ej2/diagrams';
import { InputEventArgs, TextBox, Uploader } from '@syncfusion/ej2/inputs';
import { ClickEventArgs, ItemModel, Toolbar } from '@syncfusion/ej2/navigations';
import { createSpinner, Dialog } from '@syncfusion/ej2/popups';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2/splitbuttons';
import { convertTextToUmlSequenceDiagram } from './ai-Umlsequencediagram';
import { sequenceModel, toolbarItems, exportItems, zoomMenuItems } from './dataSource'
Diagram.Inject(PrintAndExport);

//Initializes diagram control
let diagram: Diagram | any = new Diagram({
  width: '100%', height: '900px',
  tool: DiagramTools.ZoomPan,
  snapSettings: { constraints: SnapConstraints.None },
  model: sequenceModel,
  // Define default properties for nodes used in the diagram
  getNodeDefaults: (node: NodeModel) => {
    // participant node
    if (node.data instanceof UmlSequenceParticipant) {
      if (!node.data.isActor) {
        if (node.annotations && node.annotations[0] && node.annotations[0].style) {
          node.annotations[0].style.color = 'white';
        }
      }
    }
    // fragment node
    else if (node.data instanceof UmlSequenceFragment) {
      node.style = { strokeColor: 'cornflowerblue' };
    }
  },
  scrollChange: function (args: IScrollChangeEventArgs) {
    if (args.panState !== 'Start') {
      let zoomCurrentValue: any = (document.getElementById("btnZoomIncrement") as any).ej2_instances[0];
      zoomCurrentValue.content = Math.round(diagram.scrollSettings.currentZoom * 100) + ' %';
    }
  },
});
diagram.appendTo('#diagram');

//Button
let button = new Fab({ isPrimary: true, content: 'AI Assist', iconCss: 'e-icons e-assistview-icon' });
button.appendTo('#ai-assist');

//Initialize Toolbar component
let toolbarObj: Toolbar = new Toolbar({
  clicked: function (args: any) { toolbarClick(args); },
  created: function () {
    if (diagram !== undefined) {
      let btnZoomIncrement: DropDownButton = new DropDownButton({
        items: zoomMenuItems, content: Math.round(diagram.scrollSettings.currentZoom * 100) + ' %', select: zoomChange,
      });
      btnZoomIncrement.appendTo('#btnZoomIncrement');

      let exportBtn: DropDownButton = new DropDownButton({
        items: exportItems, iconCss: 'e-ddb-icons e-export', select: function (args) { onselectExport(args); },
      });
      exportBtn.appendTo('#exportBtn');
    }
  },
  items: toolbarItems(), width: '100%', height: 40
});

toolbarObj.appendTo('#toolbarEditor');


let uploadObject: Uploader = new Uploader({
  asyncSettings: {
    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
  }, success: onUploadSuccess, showFileList: false
});
uploadObject.appendTo('#fileupload');
function printDiagram() {
  let options: IExportOptions = {};
  options.mode = 'Download';
  options.region = 'Content';
  options.multiplePage = diagram.pageSettings.multiplePage;
  options.pageHeight = diagram.pageSettings.height;
  options.pageWidth = diagram.pageSettings.width;
  diagram.print(options);
}
function toolbarClick(args: ClickEventArgs) {
  let item = args.item.tooltipText;
  switch (item) {
    case 'Select Tool':
      diagram.clearSelection();
      diagram.tool = DiagramTools.Default;
      break;
    case 'Pan Tool':
      diagram.clearSelection();
      diagram.tool = DiagramTools.ZoomPan;
      break;
    case 'New Diagram':
      diagram.clear();
      break;
    case 'Print Diagram':
      printDiagram();
      break;
    case 'Save Diagram':
      download(diagram.saveDiagram());
      break;
    case 'Open Diagram':
      (document.getElementsByClassName('e-file-select-wrap') as any)[0]
        .querySelector('button')
        .click();
      break;
  }
  diagram.dataBind();
}
function zoomChange(args: MenuEventArgs) {
  const zoomCurrentValue: DropDownButton = (document.getElementById("btnZoomIncrement") as any).ej2_instances[0];
  const currentZoom: number = diagram.scrollSettings.currentZoom;
  let zoomFactor: number;
  switch (args.item.text) {
    case 'Zoom In':
      diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
      break;
    case 'Zoom Out':
      diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
      break;
    case 'Zoom to Fit':
      zoomFactor = 1 / currentZoom - 1;
      diagram.zoomTo({ zoomFactor });
      break;
    case 'Zoom to 50%':
      zoomFactor = 0.5 / currentZoom - 1;
      diagram.zoomTo({ zoomFactor });
      break;
    case 'Zoom to 100%':
      zoomFactor = 1 / currentZoom - 1;
      diagram.zoomTo({ zoomFactor });
      break;
    case 'Zoom to 200%':
      zoomFactor = 2 / currentZoom - 1;
      diagram.zoomTo({ zoomFactor });
      break;
  }

  zoomCurrentValue.content = Math.round(diagram.scrollSettings.currentZoom * 100) + '%';
}

//Export the diagraming object based on the format.
function onselectExport(args: MenuEventArgs) {
  let exportOptions: IExportOptions = {};
  exportOptions.format = args.item.text as FileFormats;
  exportOptions.mode = 'Download';
  exportOptions.region = 'PageSettings';
  exportOptions.fileName = 'Export';
  exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
  diagram.exportDiagram(exportOptions);
}
function onUploadSuccess(args: any) {
  let file = args.file;
  let rawFile = file.rawFile;
  let reader = new FileReader();
  reader.readAsText(rawFile);
  reader.onloadend = loadDiagram;
}
function loadDiagram(event: any) {
  diagram.loadDiagram(event.target.result);
}


function download(data: string) {
  if ((window.navigator as any).msSaveBlob) {
    let blob: Blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
    (window.navigator as any).msSaveOrOpenBlob(blob, 'Diagram.json');
  }
  else {
    let dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    let ele = document.createElement('a');
    ele.href = dataString;
    ele.download = 'Diagram.json';
    document.body.appendChild(ele);
    ele.click();
    ele.remove();
  }
}

// Dialog

let dialog: Dialog = new Dialog({
  header: '<span class="e-icons e-assistview-icon" style="color: black;width:20px; font-size: 16px;"></span> AI Assist',
  showCloseIcon: true,
  isModal: true,
  content: `<p style="margin-bottom: 10px;font-weight:bold;">Suggested Prompts</p>
    <button id="btn1" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Sequence Diagram for ATM Transaction Process</button>
    <button id="btn2" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Sequence Diagram for User Authentication and Authorization</button>
    <button id="btn3" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Sequence Diagram for Medical Appointment Scheduling</button>
    <div style="display: flex; align-items: center; margin-top: 20px;">
    <input type="text" id="textBox" class="db-openai-textbox" style="flex: 1;" />
    <button id="db-send" style="margin-left: 5px; height: 32px; width: 32px;padding:0px;"></button>
    </div>
    `,
  target: document.getElementById('control-section') as HTMLElement,
  width: '540px',
  visible: false,
  height: '310px',
});
dialog.appendTo('#dialog');
// Render buttons
const buttonIds = ['btn1', 'btn2', 'btn3'];
buttonIds.forEach(id => {
  let button = new Button();
  button.appendTo(`#${id}`);
});
// Initialize and append the send button
let sendButton: Button = new Button({ iconCss: 'e-icons e-send', isPrimary: true, disabled: true });
sendButton.appendTo('#db-send');
// Initialize and append the text box
let textBox = new TextBox({ placeholder: 'Please enter your prompt here...', width: 450, input: onTextBoxChange });
textBox.appendTo('#textBox');
// Get references to the buttons
let [msgBtn1, msgBtn2, msgBtn3] = buttonIds.map(id => document.getElementById(id) as HTMLInputElement);

(document.getElementById('ai-assist') as HTMLInputElement).onclick = () => {
  dialog.show();
}

(document.getElementById('db-send') as HTMLInputElement).onclick = () => {
  dialog.hide();
  convertTextToUmlSequenceDiagram(textBox.value, diagram)
}

function onTextBoxChange(args: InputEventArgs) {
  if (args.value !== '') {
    sendButton.disabled = false;
  } else {
    sendButton.disabled = true;
  }
}

msgBtn1.onclick = () => {
  dialog.hide();
  convertTextToUmlSequenceDiagram(msgBtn1.value, diagram);
}
msgBtn2.onclick = () => {
  dialog.hide();
  convertTextToUmlSequenceDiagram(msgBtn1.value, diagram);

}
msgBtn3.onclick = () => {
  dialog.hide();
  convertTextToUmlSequenceDiagram(msgBtn1.value, diagram);
}
// Add keypress event listener to the document
document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && document.activeElement === textBox.element) {
    if (textBox.value !== '') {
      dialog.hide();
      convertTextToUmlSequenceDiagram(textBox.value, diagram);
    }
  }
});

createSpinner({
  target: document.getElementById('loadingContainer') as HTMLDivElement,
  type: 'Bootstrap', label: 'Generating Sequence Diagram...'

});