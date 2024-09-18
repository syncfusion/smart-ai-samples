import { SmartPasteButton, ChatOptions } from "@syncfusion/ej2-buttons";
import { TextArea, TextBox } from "@syncfusion/ej2-inputs";
import { getAzureTextAIRequest,getAzureChatAIRequest } from '../ai-models';
import { Button, ChipList, ClickEventArgs, RadioButton } from "@syncfusion/ej2-buttons";
import { ComboBox } from "@syncfusion/ej2/dropdowns";
import { copy } from "@syncfusion/ej2/spreadsheet";

let inputobj1: TextBox = new TextBox({
  placeholder: "What's the bug ?",
  floatLabelType: "Never",
});
inputobj1.appendTo("#bug-name");

let inputobj2: TextBox = new TextBox({
  placeholder: "Who is the reporter ?",
  floatLabelType: "Never",
});
inputobj2.appendTo("#reporter-name");

let inputobj3: TextBox = new TextBox({
  placeholder: "When it is reported ?",
  floatLabelType: "Never",
});
inputobj3.appendTo("#submitted-date");

let textArea1: TextArea = new TextArea({
  placeholder: "Describe a little about the bug.",
  rows: 2,
  floatLabelType: "Never",
});
textArea1.appendTo("#bug-description");

let textArea2: TextArea = new TextArea({
  placeholder: "Enter the repro steps here..",
  cols: 30,
  rows: 4,
  floatLabelType: "Never",
});
textArea2.appendTo("#reproduce-steps");

let radioButton: RadioButton = new RadioButton({
  label: "Low",
  name: "bug-priority",
  value: "low"
});
radioButton.appendTo("#radio1");

radioButton = new RadioButton({
  label: "Medium",
  name: "bug-priority",
  value: "medium",
  checked: true
});
radioButton.appendTo("#radio2");

radioButton = new RadioButton({
  label: "High",
  name: "bug-priority",
  value: "high",
});
radioButton.appendTo("#radio3");

const browserData: string[] = [
  'Chrome', 'Firefox', 'Safari'
];
let comboBoxObj: ComboBox = new ComboBox({
  popupHeight: '230px',
  dataSource: browserData,
  placeholder: 'Choose the browser',
});
comboBoxObj.appendTo('#browser');

// Initialize Button component.
let resetButton: Button = new Button({
  content: 'Reset',
  iconCss: "e-icons e-reset",
});
// Render initialized Button.
resetButton.appendTo('#reset');


export const serverAIRequest = async (options: ChatOptions) => {
  let output: string | null = '';
  try {
    // console.log("input:", options);
    output = await getAzureChatAIRequest(options) as string;
    output = output.replace('END_RESPONSE', '')
    // console.log("Success:", output);
  } catch (error) {
    console.error("Error:", error);
  }
  return output;
};

// Initialize Button component.
let button: SmartPasteButton = new SmartPasteButton({
  content: 'Smart Paste',
  iconCss: "e-icons e-paste",
  aiAssistHandler: serverAIRequest
});
// Render initialized Button.
button.appendTo('#smart-paste');


// Property Pane Code

// let bugPresets: string[] = [
//   "Issue with the dropdown menu",
//   "Trouble logging into the website",
//   "Search functionality not working",
//   "Images missing on the product page"
// ];

// let bugReports: string[] = [
//   `Hi, this is Alice. On July 3rd, I've come across a bug where the dropdown menu in the navigation bar doesn't close after selecting an item. I just navigated to the homepage, opened the dropdown menu in the navigation bar, clicked an item in the dropdown and then the issue occurred which happens only on Chrome. Though this doesn't seem like a serious/important bug, kindly look into it and resolve it. Regards, J Alice Abraham`,
//   `Hey team, On May 2nd, K John Doe reported an issue where the login page refreshes instead of logging in when the user clicks the login button. This problem prevents users from accessing their accounts, making it a critical issue that needs immediate attention. The issue has been observed across all major browsers. To reproduce the issue, open any browser and navigate to the website's login page. Enter a valid username and password, then click the Login button.`,
//   `Hi, Whenever I type something in the search bar and hit search, it doesn't return any results, even for items I know exist. This problem was noticed by Jane Smith on July 5th in FireFox browser. You can repro the issue by opening the site in the Firefox browser and navigate to the search bar. Type in any search term, including items that are known to exist, and click the search button. The search functionality fails to return any results, displaying an empty result set even for valid queries. This is quite important, but not urgent. Please look into it. Regards, M William Marker`,
//   `Hello, When I selected the category option on the landing page and chose the electronics category, the images were missing on the product page. The placeholders are there, but no actual images are loading. This happens on all browsers. I reported this on July 3rd. It's not urgent, but it does affect the user experience. Regards, L Mike Johnson`
// ];

// let copyContent: HTMLElement = document.getElementById('bug-report-text') as HTMLElement;
// copyContent.innerHTML = bugReports[0];

const idarray = ['1', '2'];
const butInstance: { [key: string]: HTMLElement | null } = {
  'button1': document.getElementById('copy1'),
  'button2': document.getElementById('copy2')
};
idarray.forEach((id) => {
  document.getElementById('copy'+id)?.addEventListener('click', () => copyContent(id));
})
async function copyContent (id: string) {
  
  let text = document.getElementById('copy-content'+id)?.innerHTML;
  await navigator.clipboard.writeText(text as string);
  let inactive: string = idarray.filter((item) => item !== id)[0];
  butInstance['button'+inactive]?.querySelector('span')?.classList.replace('e-check', 'e-copy');
  butInstance['button'+id]?.querySelector('span')?.classList.replace('e-copy', 'e-check');
 // button.querySelector('span')?.classList.replace('e-copy', 'e-check');
  // copyButton.content = "Copied";
  // copyButton.iconCss = "e-icons e-check";
}

// let chipList = new ChipList(
//   {
//     chips: bugPresets, selection: 'Single',
//     selectedChips: [0],
//     click: (e: ClickEventArgs) => {
//       copyContent.innerHTML = bugReports[e.index as number] as string;
//       chipList.selectedChips = e.index as number;
//       copyButton.content = "Copy";
//       copyButton.iconCss = "e-icons e-copy";
//     }
//   },
//   '#chip-choice');
