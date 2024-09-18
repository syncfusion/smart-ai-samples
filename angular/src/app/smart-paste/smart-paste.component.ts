import { Component, OnInit, viewChild, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ButtonComponent, ButtonAllModule, SmartPasteButtonAllModule , RadioButtonAllModule, ChipListModule, ClickEventArgs } from '@syncfusion/ej2-angular-buttons';
import {  ComboBoxModule} from '@syncfusion/ej2-angular-dropdowns';
import { TextAreaAllModule,TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import {DatePickerAllModule} from '@syncfusion/ej2-angular-calendars';
import { getAzureChatAIRequest } from '../ai-models/ai-models';
import { VirtualElementHandler } from '@syncfusion/ej2-angular-grids';
import { createSpinner, showSpinner } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-smart-paste',
  standalone: true,
  imports: [ButtonAllModule, ChipListModule,TextBoxAllModule,RadioButtonAllModule,SmartPasteButtonAllModule,ComboBoxModule, TextAreaAllModule,DatePickerAllModule],
  templateUrl: './smart-paste.component.html',
  styleUrls: ['./smart-paste.component.css']
})
export class SmartPasteComponent implements OnInit {
  @ViewChild('smart') public smartPaste: any;
  @ViewChild('copyButton1', { static: true } ) public copyButton1!: ButtonComponent;
  @ViewChild('copyButton2', { static: true } ) public copyButton2!: ButtonComponent;
  public buttonInstance: { [key: string]: HTMLElement | null } = {};
  public idArray: string[] = ['1', '2'];
  bugForm!: FormGroup;
  browsers: string[] = ['Chrome', 'Firefox', 'Edge', 'Safari'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
   
    this.bugForm = this.fb.group({
      bugName: [''],
      reporterName: [''],
      submittedDate: [''],
      bugDescription: [''],
      reproduceSteps: [''],
      bugPriority: [''],
      browser: ['']
    });
    this.buttonInstance = {
      button1: this.copyButton1.element,
      button2: this.copyButton2.element,
  };
  }
// Property Pane Code

 public bugPresets: string[] = [
  "Issue with the dropdown menu",
  "Trouble logging into the website",
  "Search functionality not working",
  "Images missing on the product page"
];

public  bugReports: string[] = [
  `Hi, this is Alice. On July 3rd, I've come across a bug where the dropdown menu in the navigation bar doesn't close after selecting an item. I just navigated to the homepage, opened the dropdown menu in the navigation bar, clicked an item in the dropdown and then the issue occurred which happens only on Chrome. Though this doesn't seem like a serious/important bug, kindly look into it and resolve it. Regards, J Alice Abraham`,
  `Hey team, On May 2nd, K John Doe reported an issue where the login page refreshes instead of logging in when the user clicks the login button. This problem prevents users from accessing their accounts, making it a critical issue that needs immediate attention. The issue has been observed across all major browsers. To reproduce the issue, open any browser and navigate to the website's login page. Enter a valid username and password, then click the Login button.`,
  `Hi, Whenever I type something in the search bar and hit search, it doesn't return any results, even for items I know exist. This problem was noticed by Jane Smith on July 5th in FireFox browser. You can repro the issue by opening the site in the Firefox browser and navigate to the search bar. Type in any search term, including items that are known to exist, and click the search button. The search functionality fails to return any results, displaying an empty result set even for valid queries. This is quite important, but not urgent. Please look into it. Regards, M William Marker`,
  `Hello, When I selected the category option on the landing page and chose the electronics category, the images were missing on the product page. The placeholders are there, but no actual images are loading. This happens on all browsers. I reported this on July 3rd. It's not urgent, but it does affect the user experience. Regards, L Mike Johnson`
];

  onReset(): void {
    this.bugForm.reset();
  }
  
public serverAIRequest = async (settings: any) => {
  let output = '';
  try {
      console.log(settings);
      const response = await getAzureChatAIRequest(settings) as string;
      console.log("Success:", response);
      output = response;
  } catch (error) {
      console.error("Error:", error);
  }
  return output;
};
  onCreated(): void {
    this.smartPaste.aiAssistHandler = this.serverAIRequest;
  }

async copyContent(id: string) {
  if (!document.hasFocus()) {
    window.focus(); // Bring the document into focus
  }
  let text = document.getElementById('copy-content' + id)?.innerText;
  await navigator.clipboard.writeText(text as string);
  let inactive: string = this.idArray.filter((item) => item !== id)[0];
  this.buttonInstance['button' + inactive]?.querySelector('span')?.classList.replace('e-check', 'e-copy');
  this.buttonInstance['button' + id]?.querySelector('span')?.classList.replace('e-copy', 'e-check');
}
  
  }
  