
import { Button } from '@syncfusion/ej2/buttons';
import { ImageEditor } from '@syncfusion/ej2-image-editor';
import { StabilityAiModel, StabilityAiModelBGRemover, StabilityAiModelMagicEraser } from '../../stability-ai-model';
import { Sidebar, Toolbar, NodeSelectEventArgs, TreeView, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { ColorPicker, ColorPickerEventArgs, PaletteTileEventArgs, TextBox } from '@syncfusion/ej2/inputs';
import { hideSpinner, showSpinner } from '@syncfusion/ej2/popups';
import {Draggable} from  '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2/base';

let colorPickerVal: string = '';
const wrapperDiv = document.getElementById('wrapper-container') as HTMLElement;

const draggableElements = ['magic-eraser', 'bg-changer'];
draggableElements.forEach(className => {
    const dragElement = document.getElementsByClassName(className)[0] as HTMLElement;
    new Draggable(dragElement, { clone: false });
});

const buttonsConfig = [
    { selector: '#remove-btn', options: { iconCss: 'e-icons e-close', cssClass: 'e-small e-round', isPrimary: true } },
    { selector: '#eraseBtn', options: { cssClass: 'e-primary' } },
    { selector: '#bgChangeBtn', options: { cssClass: 'e-primary' } },
    { selector: '#bg-change-remove-btn', options: { iconCss: 'e-icons e-close', cssClass: 'e-small e-round', isPrimary: true } }
];

buttonsConfig.forEach(config => {
    const button = new Button(config.options);
    button.appendTo(config.selector);
});

new ColorPicker({
    change: change
}, '#color-picker');

const colorPicker: ColorPicker = new ColorPicker({
    mode: 'Palette',
    modeSwitcher: false,
    inline: true,
    showButtons: false,
    columns: 6,
    presetColors: {
        'custom': ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#2196f3', '#03a9f4', '#00bcd4',
            '#009688', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107']
    },
    beforeTileRender: (args: PaletteTileEventArgs) => {
        args.element.classList.add('e-circle-palette');
        args.element.appendChild(createElement('span', { className: 'e-circle-selection' }));
    },
    change: change
}, '#circle-palette');

function change(args: ColorPickerEventArgs): void {
  colorPickerVal = args.currentValue.hex;
  imageEditorObj.open('', false, {backgroundColor: colorPickerVal });
}

const outlineTextBox: TextBox = new TextBox({
  placeholder: 'Example: Waterfalls, Mountains, etc..',
  cssClass: 'e-outline'
});
outlineTextBox.appendTo('#outlined');

const imageEditorObj: ImageEditor = new ImageEditor({
  fileOpened: (): void => {
    setTimeout(() => {
      imageEditorObj.update();
     }, 200);
  },
  created: (): void => {
    imageEditorObj.open('https://images.pexels.com/photos/103123/pexels-photo-103123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  }
});
imageEditorObj.appendTo('#imageeditor');

const folderEle: string = '<div class= "e-folder"><div class= "e-folder-name">AI Image Editor</div></div>'; 
const treeData: { [key: string]: Object }[] = [
    { id: "1", name: "Magic Eraser", imageUrl: "images/object-remover.gif" },
    { id: "2", name: "Change Background", imageUrl: "images/change-bg.png" },
    { id: "2", name: "Remove Background", imageUrl: "images/remove-bg.png" }
]
const toolbarObj: Toolbar = new Toolbar({
    cssClass: "defaultToolbar",
    height: "50px",
    clicked: ToolbarCliked,
    items: [
        { prefixIcon: "e-tbar-menu-icon tb-icons", tooltipText: "Menu" },
        { template: folderEle, cssClass: "e-folder" }
    ]
});
toolbarObj.appendTo("#defaultToolbar");

const sideObj: Sidebar = new Sidebar({
    width: "200px",
    target: ".maincontent",        
    position: 'Left',
    type: 'Push',
});
sideObj.appendTo("#defaultSidebar");

const treeObj: TreeView = new TreeView({
  nodeSelected: OnSelect,
  fields: { dataSource: treeData, id: "id", text: "name", selected: "selected", parentID: "pid", hasChildren: "hasChild", expanded: "expanded" }
});
treeObj.appendTo("#defaultTree");

function ToolbarCliked(args: ClickEventArgs): void {
    if(args.item.tooltipText == "Menu") {
      sideObj.toggle();
      setTimeout(() => {
        imageEditorObj.update();
      }, 500);
    }
}

// Assume you already have an ImageData object named imageData
function imageDataToBase64(imageData: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }
    return '';
}

function toggleDisplay(elementClassToShow: string, elementClassToHide: string): void {
    (document.getElementsByClassName(elementClassToHide)[0] as HTMLElement).style.display = 'none';
    (document.getElementsByClassName(elementClassToShow)[0] as HTMLElement).style.display = 'block';
}

function processImageData(): void {
    showSpinner(imageEditorObj.element);
    wrapperDiv.style.opacity = '0.5';
    let imageData = (imageEditorObj as any).getImageData(false);
    let url = imageDataToBase64(imageData);
    const file = base64ToFile(url, 'image.png');
    removeBG(file);
}

function OnSelect(args: NodeSelectEventArgs): void {
    switch (args.nodeData.text) {
      case "Magic Eraser":
          toggleDisplay('magic-eraser', 'bg-changer');
          imageEditorObj.update();
          imageEditorObj.element.setAttribute('data-value', 'mask-drawing');
          (imageEditorObj as any).freehandDraw(true);
          treeObj.selectedNodes = [];
          break;
      case "Change Background":
          toggleDisplay('bg-changer', 'magic-eraser');
          treeObj.selectedNodes = [];
          processImageData();
          break;
      case "Remove Background":
          processImageData();
          break;
    }
}

function bgRemoveBtnClick() {
    (document.getElementsByClassName('bg-changer')[0] as HTMLElement).style.display = 'none';
    colorPicker.refresh();
    colorPickerVal = '#ffffff';
    outlineTextBox.value = '';
    const selectedElement = (colorPicker.element.parentElement as HTMLElement).querySelector('.e-selected');
    if (selectedElement) {
        selectedElement.classList.remove('e-selected');
    }
    hideSpinner(imageEditorObj.element);
    wrapperDiv.style.opacity = '1';
}

function getImageDataAsBase64(imageEditor: ImageEditor): string {
  const imageData = imageEditor.getImageData(false);
  return imageDataToBase64(imageData);
}

function base64ToFile(base64String: string, fileName: string) {
  const byteString = atob(base64String.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([intArray], { type: 'image/png' });
  const file = new File([blob], fileName, { type: 'image/png' });
  return file;
}

function removeBG(file: File) {
  let aiOutput = StabilityAiModelBGRemover(file);
  aiOutput.then((result:any) => {
    imageEditorObj.open(result, false, { backgroundColor: '' });
    setTimeout(() => {
      hideSpinner(imageEditorObj.element);
      wrapperDiv.style.opacity = '1';
      treeObj.selectedNodes = [];
    }, 100);
  });
}

document.getElementById('remove-btn')!.onclick = (): void => {
  imageEditorObj.element.setAttribute('data-value', '');
  (document.getElementsByClassName('magic-eraser')[0] as HTMLElement).style.display = 'none';
  hideSpinner(imageEditorObj.element);
  wrapperDiv.style.opacity = '1';
  imageEditorObj.discard();
}

document.getElementById('bg-change-remove-btn')!.onclick = (): void => {
    bgRemoveBtnClick();
}

document.getElementById('eraseBtn')!.onclick = (): void => {
  const maskUrl = getImageDataAsBase64(imageEditorObj);
  imageEditorObj.element.setAttribute('data-value', '');
  imageEditorObj.freehandDraw(false);
  const url = getImageDataAsBase64(imageEditorObj);
  showSpinner(imageEditorObj.element);
  const file = base64ToFile(url, 'image.png');
  const maskFile = base64ToFile(maskUrl, 'mask.png');
  const aiOutput = StabilityAiModelMagicEraser(file, maskFile);
  aiOutput.then((result:any) => {
    imageEditorObj.open(result, false, { backgroundColor: '' });
    setTimeout(() => {
        hideSpinner(imageEditorObj.element);
        wrapperDiv.style.opacity = '1';
        treeObj.selectedNodes = [];
    }, 100);
    (document.getElementsByClassName('magic-eraser')[0] as HTMLElement).style.display = 'none';
});
}

document.getElementById('bgChangeBtn')!.onclick = (): void => {
  showSpinner(imageEditorObj.element);
  wrapperDiv.style.opacity = '0.5';
  if (outlineTextBox.value && outlineTextBox.value !== '') {
    let url = getImageDataAsBase64(imageEditorObj);
    const file = base64ToFile(url, 'image.png');
    let prompt = outlineTextBox.value;
    let searchPrompt = 'Background of the image';
    let aiOutput = StabilityAiModel(file, prompt, searchPrompt);
    aiOutput.then((result) => {
      imageEditorObj.open(result, false, { backgroundColor: '' });
      setTimeout(() => {
        bgRemoveBtnClick();
      }, 100);
      (document.getElementsByClassName('bg-changer')[0] as HTMLElement).style.display = 'none';
    });
  } else {
    bgRemoveBtnClick();
  }
}
