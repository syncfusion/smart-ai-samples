<template>
  <div id="root-container">
    <h2 style="text-align:center;">Smart Paste Button</h2>

    <div class="description-container e-card">
      <div class='e-card-content'>
        <p>
          The <b>SmartPasteButton</b> is an AI-powered upgrade of Syncfusion's Button, adding smart pasting
          features. It uses AI to paste clipboard data in the right context and format automatically.
        </p>
        <p>
          To quickly fill out the bug report form, copy the sample content and click the Smart Paste button. Know
          more <a
            href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-smart-paste/Readme.md">here</a>.
        </p>
      </div>
    </div>

    <form class="form-container container bug-form-container">
      <div style="text-align:center;"><span>Bug Report Form</span></div>
      <div class="single-row-group">
        <label for="bug-name" class="e-form-label">Bug Name </label>
        <ejs-textbox id="bug-name" placeholder="What's the bug ?" floatLabelType="Never"></ejs-textbox>
      </div>

      <div class="row-group">
        <div>
          <label for="reporter-name" class="e-form-label">Reporter</label>
          <ejs-textbox id="reporter-name" placeholder="Who is the reporter ?" floatLabelType="Never"></ejs-textbox>
        </div>
        <div>
          <label for="submitted-date" class="e-form-label">Submitted Date</label>
          <ejs-textbox id="submitted-date" placeholder="When it is reported ?" floatLabelType="Never"></ejs-textbox>
        </div>
      </div>

      <div class="form-group">
        <label for="bug-description" class="e-form-label">Bug Description</label>
        <ejs-textarea id="bug-description" placeholder="Describe a little about the bug." :rows="2"
          floatLabelType="Never"></ejs-textarea>
      </div>

      <div class="row-group">
        <div style="display: flex;flex-direction: column;">
          <label for="reproduce-steps" class="e-form-label">Reproduce Steps</label>
          <ejs-textarea id="reproduce-steps" placeholder="Enter the repro steps here.." :cols="30" :rows="4"
            floatLabelType="Never"></ejs-textarea>
        </div>
        <div>
          <label class="form-label">Bug Priority</label><br>
          <ejs-radiobutton label="Low" name="bug-priority" value="low"></ejs-radiobutton>
          <ejs-radiobutton label="Medium" name="bug-priority" value="medium" :checked="true"></ejs-radiobutton>
          <ejs-radiobutton label="High" name="bug-priority" value="high"></ejs-radiobutton>
        </div>
      </div>

      <div>
        <label for="browser" class="form-label">Select the browser</label>
        <ejs-combobox id="browser" :dataSource="browserData" placeholder="Choose the browser"
          popupHeight="230px"></ejs-combobox>
      </div>

      <div class="form-footer">
        <ejs-button id="reset" content="Reset" iconCss="e-icons e-reset" type="reset"></ejs-button>
        <ejs-smartpastebutton id="smart-paste" content="Smart Paste" iconCss="e-icons e-paste"
          :aiAssistHandler="serverAIRequest"></ejs-smartpastebutton>
      </div>
    </form>

    <div class="col-lg-12 property-section" style="padding-top: 5px;">
      <h4 style="text-align:center;"> Sample content </h4>
      <div class="content-flexed">
        <div class="content-body" data-index="0">
          <div class="copy-container" style="float: right">
            <ejs-button id="copy1" aria-label="content-copy-button"
              cssClass="e-control e-btn e-lib custom-copy-icon e-primary e-icon-btn" @click="copyContent('1')">
              <span class="e-icons e-copy e-btn-icon"></span>
            </ejs-button>
          </div>
          <div id="copy-content1">
            Hi, this is Alice. On July 3rd, I've come across a bug where the dropdown menu in the navigation bar doesn't
            close after selecting an item. I just navigated to the homepage, opened the dropdown menu in the navigation
            bar, clicked an item in the dropdown and then the issue occurred which happens only on Chrome. Though this
            doesn't seem like a serious/important bug, kindly look into it and resolve it. Regards, J Alice Abraham
          </div>
        </div>
        <div class="content-body" data-index="1">
          <div class="copy-container" style="float: right">
            <ejs-button id="copy2" aria-label="content-copy-button"
              cssClass="e-control e-btn e-lib custom-copy-icon e-primary e-icon-btn" @click="copyContent('2')">
              <span class="e-icons e-copy e-btn-icon"></span>
            </ejs-button>
          </div>
          <div id="copy-content2">
            Hi, Whenever I type something in the search bar and hit search, it doesn't return any results, even for
            items I know exist. This problem was noticed by Jane Smith on July 5th in FireFox browser. You can repro the
            issue by opening the site in the Firefox browser and navigate to the search bar. Type in any search term,
            including items that are known to exist, and click the search button. The search functionality fails to
            return any results, displaying an empty result set even for valid queries. This is quite important, but not
            urgent. Please look into it. Regards, M William Marker.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SmartPasteButtonComponent, ChatOptions, ButtonComponent, RadioButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { TextBoxComponent, TextAreaComponent } from "@syncfusion/ej2-vue-inputs";
import { ComboBoxComponent } from "@syncfusion/ej2-vue-dropdowns";
import { getAzureChatAIRequest } from '../common/ai-models';

export default defineComponent({
  name: 'App',
  components: {
    'ejs-smartpastebutton': SmartPasteButtonComponent,
    'ejs-button': ButtonComponent,
    'ejs-textbox': TextBoxComponent,
    'ejs-textarea': TextAreaComponent,
    'ejs-radiobutton': RadioButtonComponent,
    'ejs-combobox': ComboBoxComponent
  },
  data() {
    return {
      browserData: ['Chrome', 'Firefox', 'Safari']
    }
  },
  methods: {
    serverAIRequest: async (options: ChatOptions) => {
      let output: string | null = '';
      try {
        output = await getAzureChatAIRequest(options) as string;
        output = output.replace('END_RESPONSE', '')
      } catch (error) {
        console.error("Error:", error);
      }
      return output;
    },
    copyContent: async function (id: string) {
      let text = document.getElementById('copy-content' + id)?.innerHTML;
      await navigator.clipboard.writeText(text as string);
      const idarray = ['1', '2'];
      let inactive: string = idarray.filter((item) => item !== id)[0];
      document.querySelector('#copy' + inactive + ' span')?.classList.replace('e-check', 'e-copy');
      document.querySelector('#copy' + id + ' span')?.classList.replace('e-copy', 'e-check');
    }
  }
});
</script>
<style scoped>
@import './style.css'

</style>
