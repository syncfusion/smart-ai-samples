import { getAzureChatAIRequest } from '../../../ai-models';
import {executeGridAction} from './GridAction';
// import { serverAIRequest } from '../../../ai-service';


function onPromptExecute(text: string | undefined, gridInstance: any, dialogInstance: any, assistInstance: any, columns: any) {
    let textArea = `Convert the following natural language query into a JSON object representing Syncfusion Query operations.

    Rules:
    - Output only the JSON object, no extra text.
    - Field names must be from: ${JSON.stringify(columns)}.
    - Sort direction must be either "Ascending" or "Descending".

    Action Handling:
    - Include only the actions explicitly mentioned in the query: filter, sort, page, group, clearFilter, clearSort, clearGroup.
    - Operator shold be (startswith, endswith, contains, doesnotstartwith, doesnotendwith, doesnotcontain, equal, notequal, greaterthan, greaterthanorequal, lessthan, lessthanorequal, isnull, isnotnull, isempty, isnotempty, between, in, notin)
    - If the query only involves filtering, include only the "filter" key.
    - If the query only involves sorting, include only the "sort" key.
    - If the query includes a clear action:
    - Use 'clearFilter: []' to clear **all filters**.
    - Use 'clearSort: []' to clear **all sorting**.
    - Use 'clearGroup: []' to clear **all grouping**.
    - If the query specifies clearing filters/sorting/grouping for specific fields, include those field names as string arrays: clearFilter: ["field1"], clearSort: ["field2"], clearGroup: ["field3"].

    Supported Operations:
    - filter: array of objects with { field, operator, value (array for "in"/"notin", otherwise single value), ignoreCase }
    - sort: array of { field, direction }
    - page: object with { pageNumber, pageSize }
    - group: array of field names

    Additional Requirement:
    - Include a "message" field in the JSON object that explains the query action, referencing the original query text.

    Query: ${text}`;

    let aiOutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: textArea }] });
    aiOutput.then((result: any) => {
        if (!result) {
            return;
        }
        let jsonResult = result;
        if (result.indexOf("```json") !== -1) {
            jsonResult = result.split("```json")[1].split("```")[0].trim();
        }
        let data;
        try {
            data = JSON.parse(jsonResult);
            executeGridAction(data, gridInstance);
        } catch (error) {
            assistInstance.addPromptResponse({ prompt: error, response: error });
            return;
        }
        assistInstance.addPromptResponse({ prompt: data.message, response: data });
        dialogInstance.hide();
    });
}

export {onPromptExecute};