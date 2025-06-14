
/**
 * Default FlowShape sample
 */

import {
  Diagram, NodeModel, UndoRedo, 
  IDragEnterEventArgs, GridlinesModel, Node,
} from '@syncfusion/ej2-diagrams';
import { Button, Fab } from '@syncfusion/ej2/buttons';
import { DataManager, Query } from '@syncfusion/ej2/data';
import { DataBinding, DiagramTools, HorizontalAlignment, IScrollChangeEventArgs, MarginModel, MindMap,PortVisibility, PrintAndExport, SelectorConstraints, Side, UserHandleModel, VerticalAlignment } from '@syncfusion/ej2/diagrams';
import { InputEventArgs, TextBox, Uploader } from '@syncfusion/ej2/inputs';
import {  Menu, Toolbar } from '@syncfusion/ej2/navigations';
import { createSpinner, Dialog } from '@syncfusion/ej2/popups';
import { DropDownButton } from '@syncfusion/ej2/splitbuttons';
import { convertTextToMindMap } from './ai-mindmap';
import { data, menuItems, toolbarItems, zoomMenuItems } from './dataSource';
import {getMindMapShape,toolbarClick,zoomChange, menuClick, loadDiagram } from './utility-methods';
import { getConnectorDefaults, getNodeDefaults, historyChange, onUserHandleMouseDown, selectionChange } from './events';
Diagram.Inject(UndoRedo, DataBinding, PrintAndExport, MindMap);

//Sets the Node style for DragEnter element.
function dragEnter(args: IDragEnterEventArgs): void {
  let obj: NodeModel = args.element as NodeModel;
  if (obj instanceof Node) {
    let oWidth: number = obj.width;
    let oHeight: number = obj.height;
    let ratio: number = 100 / obj.width;
    obj.width = 100;
    obj.height *= ratio;
    obj.offsetX += (obj.width - oWidth) / 2;
    obj.offsetY += (obj.height - oHeight) / 2;
    obj.style = { fill: '#357BD2', strokeColor: 'white' };
  }
}
let interval: number[] = [
  1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
];
let gridlines: GridlinesModel = { lineColor: '#e0e0e0', lineIntervals: interval };
export let diagram: Diagram | any;
let items = new DataManager(data, new Query().take(7));
let leftarrow = 'M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z';
let rightarrow = 'M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z';
let devareicon = 'M1.0000023,3 L7.0000024,3 7.0000024,8.75 C7.0000024,9.4399996 6.4400025,10 5.7500024,10 L2.2500024,10 C1.5600024,10 1.0000023,9.4399996 1.0000023,8.75 z M2.0699998,0 L5.9300004,0 6.3420029,0.99999994 8.0000001,0.99999994 8.0000001,2 0,2 0,0.99999994 1.6580048,0.99999994 z';
let leftuserhandle = setUserHandle('leftHandle', leftarrow, 'Left', 0.5, { top: 10, bottom: 0, left: 0, right: 10 }, 'Left', 'Top');
let rightuserhandle = setUserHandle('rightHandle', rightarrow, 'Right', 0.5, { top: 10, bottom: 0, left: 10, right: 0 }, 'Right', 'Top');
let devareuserhandle = setUserHandle('devare', devareicon, 'Top', 0.5, { top: 0, bottom: 0, left: 0, right: 0 }, 'Center', 'Center');
let handle: UserHandleModel[] = [leftuserhandle, rightuserhandle, devareuserhandle];
//set and creation of the Userhandle.
function setUserHandle(name: string, pathData: string, side: Side, offset: number, margin: MarginModel, halignment: HorizontalAlignment, valignment: VerticalAlignment) {
  var userhandle: UserHandleModel = {
    name: name,
    pathData: pathData,
    backgroundColor: 'black',
    pathColor: 'white',
    side: side,
    offset: offset,
    margin: margin,
    horizontalAlignment: halignment,
    verticalAlignment: valignment,
  };
  return userhandle;
}
//Initializes diagram control
diagram = new Diagram({
  width: '100%', height: '900px',
  selectionChange: selectionChange,
  historyChange: historyChange,
  onUserHandleMouseDown: onUserHandleMouseDown,
  tool: DiagramTools.Default,
  snapSettings: { horizontalGridlines: gridlines, verticalGridlines: gridlines },
  scrollSettings: { scrollLimit: 'Infinity' },
  layout: {
    type: 'MindMap', horizontalSpacing: 80,
    verticalSpacing: 50,
    getBranch: function (node: Node) {
      if (node.addInfo) {
        var addInfo = node.addInfo;
        return (addInfo as any).orientation.toString();
      }
      return 'Left';
    }
  },
  selectedItems: { constraints: SelectorConstraints.UserHandle, userHandles: handle },
  dataSourceSettings: {
    id: 'id',
    parentId: 'parentId',
    dataSource: items,
    root: String(1),
  },
  rulerSettings: { showRulers: true },
  scrollChange: function (args: IScrollChangeEventArgs) {
    if (args.panState !== 'Start') {
      let zoomCurrentValue: any = (document.getElementById("btnZoomIncrement") as any).ej2_instances[0];
      zoomCurrentValue.content = Math.round(diagram.scrollSettings.currentZoom * 100) + ' %';
    }
  },
  //Sets the default values of a node
  getNodeDefaults: getNodeDefaults,
  //Sets the default values of a connector
  getConnectorDefaults: getConnectorDefaults,
  //Sets the Node style for DragEnter element.
  dragEnter: dragEnter,
});
diagram.appendTo('#diagram');


//Button
let button = new Fab({ isPrimary: true, content: 'AI Assist', iconCss: 'e-icons e-assistview-icon' });
button.appendTo('#ai-assist');
let btnZoomIncrement: DropDownButton;
//Initialize Toolbar component
export let toolbarObj: Toolbar = new Toolbar({
  clicked: function (args: any) { toolbarClick(args); },
  created: function () {
    if (diagram !== undefined) {
      btnZoomIncrement = new DropDownButton({
        items: zoomMenuItems, content: Math.round(diagram.scrollSettings.currentZoom * 100) + ' %', select: zoomChange,
      });
      btnZoomIncrement.appendTo('#btnZoomIncrement');
    }

  },
  items: toolbarItems(),
  width: '100%',
  height: 40
});

toolbarObj.appendTo('#toolbarEditor');

btnZoomIncrement = new DropDownButton({
  items: zoomMenuItems, content: Math.round(diagram.scrollSettings.currentZoom * 100) + ' %', select: zoomChange,
});
btnZoomIncrement.appendTo('#btnZoomIncrement');

//creation of the Ports
export function getPort() {
  var port =
    [{
      id: 'leftPort', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden,
      style: { fill: 'black' }
    },
    {
      id: 'rightPort', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden,
      style: { fill: 'black' }
    },
    {
      id: 'topPort', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hidden,
      style: { fill: 'black' }
    },
    {
      id: 'bottomPort', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hidden,
      style: { fill: 'black' }
    }
    ];
  return port;
}
let uploadObject: Uploader = new Uploader({
  asyncSettings: {
    saveUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Save',
    removeUrl: 'https://services.syncfusion.com/js/production/api/FileUploader/Remove'
  }, success: onUploadSuccess, showFileList: false
});
uploadObject.appendTo('#fileupload');

function onUploadSuccess(args: any) {
  let file = args.file;
  let rawFile = file.rawFile;
  let reader = new FileReader();
  reader.readAsText(rawFile);
  reader.onloadend = loadDiagram;
}


// Dialog

let dialog: Dialog = new Dialog({
  header: '<span class="e-icons e-assistview-icon" style="color: black;width:20px; font-size: 16px;"></span> AI Assist',
  showCloseIcon: true,
  isModal: true,
  content: `<p style="margin-bottom: 10px;font-weight:bold;">Suggested Prompts</p>
  <button id="btn1" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Mindmap for top tourist places in the world</button>
  <button id="btn2" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Mindmap for categories of topics in science</button>
  <button id="btn3" style="flex: 1; overflow: visible; border-radius: 8px;margin-bottom: 10px;">Mindmap for different components in syncfusion</button>
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
let btn1: Button = new Button();
let btn2: Button = new Button();
let btn3: Button = new Button();
let sendButton: Button = new Button({ iconCss: 'e-icons e-send', isPrimary: true, disabled: true });
btn1.appendTo('#btn1');
btn2.appendTo('#btn2');
btn3.appendTo('#btn3');
sendButton.appendTo('#db-send');
let textBox = new TextBox({ placeholder: 'Please enter your prompt here...', width: 450, input: onTextBoxChange });
textBox.appendTo('#textBox');
let msgBtn1 = (document.getElementById('btn1') as HTMLInputElement);
let msgBtn2 = (document.getElementById('btn2') as HTMLInputElement);
let msgBtn3 = (document.getElementById('btn3') as HTMLInputElement);


// Menu initialization
let menu: Menu = new Menu({
  items: menuItems, select: menuClick
}, '#menu');

(document.getElementById('ai-assist') as HTMLInputElement).onclick = () => {
  dialog.show();
}

(document.getElementById('db-send') as HTMLInputElement).onclick = () => {
  dialog.hide();
  convertTextToMindMap(textBox.value,diagram)
}

(document.getElementById('closeIconDiv') as HTMLElement).onclick = () => {
  onHideNodeClick()
}

function onHideNodeClick() {
  var node1 = document.getElementById('shortcutDiv') as HTMLElement;
  node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
  (menu.items[3] as any).items[1].iconCss = node1.style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
  diagram.dataBind();
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
  convertTextToMindMap(msgBtn1.innerText,diagram);
}
msgBtn2.onclick = () => {
  dialog.hide();
  convertTextToMindMap(msgBtn2.innerText,diagram);

}
msgBtn3.onclick = () => {
  dialog.hide();
  convertTextToMindMap(msgBtn3.innerText,diagram);
}

// Add keypress event listener to the document
document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter' && document.activeElement === textBox.element) {
    if (textBox.value) {
      dialog.hide();
      convertTextToMindMap(textBox.value,diagram);
    }
  }
});

export interface MindMapData {
  id: string;
  parentId: string;
  Label: string;
  branch: string;
  fill: string;
  strokeColor: string;
  orientation: string;
  level: number;
}

createSpinner({
  target: document.getElementById('loadingContainer') as HTMLDivElement,
  type: 'Bootstrap', label: 'Generating Mindmap...'

});