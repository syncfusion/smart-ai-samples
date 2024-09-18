import { Component, OnInit ,ViewChild} from '@angular/core';
// import { FileManager, Toolbar, NavigationPane, DetailsView, ContextMenu } from '@syncfusion/ej2-filemanager';
import { getAzureChatAIRequest } from '../../ai-models/ai-models';
import { MenuClickEventArgs, MenuOpenEventArgs } from '@syncfusion/ej2/filemanager';
import { Button, ChipList } from '@syncfusion/ej2-buttons';
import { DialogAllModule, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Ajax, extend } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { FileManagerAllModule, FileManagerComponent } from '@syncfusion/ej2-angular-filemanager';


@Component({
  selector: 'app-file-manager',
  imports: [FileManagerAllModule,DialogAllModule],
  standalone: true,
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class SmartFileManager implements OnInit {
  @ViewChild('file', { static: true }) fileObject!: any;
  @ViewChild('dialog', { static: true }) dialog!: DialogComponent;
  public hostUrl: string = 'https://filemanageraiservice.azurewebsites.net/';
  public toolbarItems: any = [
    { name: 'NewFolder' },
    { name: 'Cut' },
    { name: 'Copy' },
    { name: 'Paste' },
    { name: 'Delete' },
    { name: 'Rename' },
    { name: 'SortBy' },
    { name: 'Refresh' },
    { name: 'Selection' },
    { name: 'View' },
    { name: 'Details' },
    { text: 'Quick Summary', name: 'Quick Summary', prefixIcon: 'e-icons e-print-layout', tooltipText: 'Get a quick summary of the selected file using AI', visible: false },
  ];
  public ajaxSettings:Object =  {
    url: this.hostUrl + 'api/FileManager/FileOperations',
    getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
    uploadUrl: this.hostUrl + 'api/FileManager/Upload',
    downloadUrl: this.hostUrl + 'api/FileManager/Download'
  };
  public isVisible: boolean = false;

  public fileChips!: ChipList;
  public aiChips!: ChipList;
  public closebtn!: Button;
  public savebtn!: Button;
  public generatebtn!: Button;
  public dialogHeader: string = "File Summary";
  public dialogContent: string = "<span>Loading...</span>";
  public targetElement: HTMLElement = document.getElementById('filemanager') as HTMLElement;
  ngOnInit(): void {
 

    // this.dialog = new Dialog({
    //   header: "File Summary",
    //   content: "<span>Loading...</span>",
    //   target: document.getElementById('filemanager') as HTMLElement,
    //   showCloseIcon: true,
    //   visible: this.isVisible,
    //   isModal: true,
    //   height: '70%',
    //   width: '600px',
    //   overlayClick: this.dialogOverlay.bind(this),
    //   close: this.dialogOverlay.bind(this),
    // });
    // this.dialog.appendTo('#customTbarDialog');

    // this.fileObject = new FileManager({
    //   ajaxSettings: this.ajaxSettings,
    //   height: '520px',
    //   toolbarItems: this.toolbarItems,
    //   contextMenuSettings: { file: ["Manage Tags", "|", "Cut", "Copy", "|", "Delete", "Rename", "|", "Details"], folder: ["Open", "|", "Cut", "Copy", "Paste", "|", "Delete", "Rename", "|", "Details"], layout: ["SortBy", "View", "Refresh", "|", "Paste", "|", "NewFolder", "|", "Details", "|", "SelectAll"], visible: true },
    //   searchSettings: { allowSearchOnTyping: false },
    //   fileOpen: this.onFileOpen.bind(this),
    //   fileSelect: this.fileSelected.bind(this),
    //   menuOpen: this.menuOpen.bind(this),
    //   menuClick: this.menuClick.bind(this),
    //   fileSelection: this.fileSelection.bind(this),
    //   beforeSend: this.onSend.bind(this),
    //   toolbarClick: this.toolbarClick.bind(this),
    // });
    // this.fileObject.appendTo('#smartfilemanager');

    this.closebtn = new Button({ iconCss: 'e-icons e-close', cssClass: 'e-small' });
    this.closebtn.appendTo('#closebtn');
    this.closebtn.element.onclick = this.closeTagContainer.bind(this);

    this.savebtn = new Button({ cssClass: 'e-btn e-outline e-primary', disabled: true });
    this.savebtn.appendTo('#savebtn');
    this.savebtn.element.onclick = this.saveTags.bind(this);

    this.generatebtn = new Button({ cssClass: 'e-btn e-outline e-primary' });
    this.generatebtn.appendTo('#generatebtn');
    this.generatebtn.element.onclick = this.generateTags.bind(this);

    this.fileChips = new ChipList({ chips: [], enableDelete: true, deleted: this.chipDeleted.bind(this) });
    this.fileChips.appendTo('#fileChips');

    this.aiChips = new ChipList({ chips: [], enableDelete: true, deleted: this.aiChipDeleted.bind(this) });
    this.aiChips.appendTo('#aiChips');
  }

  dialogOverlay(): void {
    this.dialog.hide();
    this.dialog.visible = false;
    this.dialog.content = "<span>Loading...</span>";
  }

  toolbarClick(args: any): void {
    if (args.item.text == 'Quick Summary') {
      if (args.fileDetails[0].permission == null) {
        this.Summarize(args.fileDetails[0]);
      } else if (args.fileDetails[0].permission != null && !args.fileDetails[0].permission.read) {
        this.dialog.visible = true;
        this.dialog.content = "<span>" + args.fileDetails[0].name + " is not accessible. You do not have permission to read this file." + "</span>";
      }
    }
  }

  onFileOpen(args: any): void {
    var file = args.fileDetails;
    if (file != null && file.isFile && ['.txt', '.docx', '.pdf'].includes(file.type)) {
      if (file.permission == null) {
        this.Summarize(file);
      } else {
        this.dialog.visible = true;
        this.dialog.content = "<span>" + args.fileDetails.name + " is not accessible. You do not have permission to read this file." + "</span>";
      }
    } else {
      this.dialog.visible = false;
      this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
    }
  }

  fileSelected(args: any): void {
    var file = args.fileDetails;
    let items: any = extend([],this.toolbarItems);
    let flag: boolean = false;
    if (['.txt', '.docx', '.pdf'].includes(file.type) && this.fileObject.selectedItems.length == 1) {
        flag = true;
       
    } 
    items.filter((items: any) => items.name == 'Quick Summary')[0].visible = flag;
    this.toolbarItems = items;
  }

  menuOpen(args: MenuOpenEventArgs): void {
    if (args.items) {
      const manageTagsItem = 'Manage Tags';
      if (args.menuType === 'file' && this.fileObject.selectedItems.length > 1) {
        if (!this.fileObject.contextmenuModule.disabledItems.includes(manageTagsItem)) {
          this.fileObject.contextmenuModule.disabledItems.push(manageTagsItem);
        }
      } else {
        const index = this.fileObject.contextmenuModule.disabledItems.indexOf(manageTagsItem);
        if (index !== -1) {
          this.fileObject.contextmenuModule.disabledItems.splice(index, 1);
        }
      }
      for (let i: number = 0; i < args.items.length; i++) {
        if (args.items[i].id === this.fileObject.element.id + '_cm_managetags') {
          args.items[i].iconCss = 'e-icons e-bookmark';
        }
      }
    }
  }

  menuClick(args: MenuClickEventArgs): void {
    if (args.item && args.item.text === 'Manage Tags') {
      this.manageTags(args);
    }
  }

  manageTags(args: any): void {
    (document.querySelector('.filemanager_container #tags') as HTMLElement).style.display = '';
    (document.querySelector('.filemanager_container #emptyAiTag') as HTMLElement).style.display = '';
    const ajax = new Ajax({
      url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/GetTagsFromFile',
      type: 'POST',
      data: JSON.stringify(args.fileDetails[0]),
      contentType: 'application/json',
      onSuccess: (response: any) => {
        this.fileChips.chips = JSON.parse(response);
        if (this.fileChips.chips.length == 0) {
          (document.querySelector('.filemanager_container #emptyTag') as HTMLElement).style.display = '';
        } else {
          (document.querySelector('.filemanager_container #emptyTag') as HTMLElement).style.display = 'none';
        }
      },
      onFailure: (error: any) => {
        console.log(error);
      }
    });
    ajax.send();
  }

  closeTagContainer(): void {
    (document.querySelector('.filemanager_container #tags') as HTMLElement).style.display = 'none';
    this.fileChips.chips = [];
    this.aiChips.chips = [];
    this.savebtn.disabled = true;
  }

  fileSelection(args: any): void {
    this.closeTagContainer();
  }

  onSend(args: any): void {
    if (args.action == 'search') {
      const customData = JSON.parse(args.ajaxSettings.data);
      customData.isTagSearch = true;
      args.ajaxSettings.data = JSON.stringify(customData);
    }
  }

  saveTags(): void {
    let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    data[0].tags = this.aiChips.chips;
    const tags = this.aiChips.chips;
    const ajax = new Ajax({
      url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/SaveTagsToFile',
      type: 'POST',
      data: JSON.stringify(data[0]),
      contentType: 'application/json',
      onSuccess: (response: any) => {
        this.fileChips.chips = JSON.parse(response);
        (document.querySelector('.filemanager_container #emptyTag') as HTMLElement).style.display = 'none';
        (document.querySelector('.filemanager_container #emptyAiTag') as HTMLElement).style.display = '';
        this.savebtn.disabled = true;
        this.aiChips.chips = [];
      },
      onFailure: (error: any) => {
        console.log(error);
      }
    });
    ajax.send();
  }

  generateTags(): void {
    let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    const prompt: string = "Generate tags for the following content.Provide the tags in ordered list format without any undefined or irrelevant values:\n\n";
    const fileContent: string = "File Named as " + data[0].name;
    let inputData: string = prompt + fileContent;
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: inputData }] });
    aiOutput.then((result: any) => {
      this.savebtn.disabled = false;
      const tagsArray: string[] = result
        .split(/\r\n|\n\n|\n/)
        .filter((tag: string) => tag.trim() !== '')
        .map((tag: string) => tag.substring(tag.indexOf(' ') + 1).trim());
      this.aiChips.chips = tagsArray;
      (document.querySelector('.filemanager_container #emptyAiTag') as HTMLElement).style.display = 'none';
    });
  }

  chipDeleted(args: any): void {
    if (this.fileChips.chips.length == 0) {
      this.savebtn.disabled = true;
      (document.querySelector('.filemanager_container #emptyTag') as HTMLElement).style.display = '';
    }
    const fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    data[0].tags = [args.text];
    const ajax = new Ajax({
      url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/RemoveTagsFromFile',
      type: 'POST',
      data: JSON.stringify(data[0]),
      contentType: 'application/json',
      onSuccess: (response: any) => {
        this.fileChips.chips = JSON.parse(response);
      },
      onFailure: (error: any) => {
        console.log(error);
      }
    });
    ajax.send();
  }

  aiChipDeleted(args: any): void {
    if (this.aiChips.chips.length == 0) {
      this.savebtn.disabled = true;
      (document.querySelector('.filemanager_container #emptyAiTag') as HTMLElement).style.display = '';
    }
  }

  Summarize(file: any): void {
    this.dialog.visible = true;
    const ajax = new Ajax({
      url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/ExtractTextFromFile',
      type: 'POST',
      data: JSON.stringify(file),
      contentType: 'application/json',
      onSuccess: (response: any) => {
        let fileContent: string = response;
        const prompt: string = "You are a helpful assistant. Your task is to analyze the provided text and generate short summary. Provide the summary with highlighted topic in ordered list html format without additional contents:\n\n";
        let inputData: string = prompt + fileContent;
        let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: inputData }] });
        aiOutput.then((result: any) => {
          this.dialog.content = "<span>" + result + "</span>";
        });
      },
      onFailure: (error: any) => {
        this.dialog.content = "<span>Something went wrong, Please try again!</span>";
        console.error('Error:', error);
      }
    });
    ajax.send();
  }
}