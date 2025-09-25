import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, Sort, Filter, Group, Page, Search, ToolbarItems, FilterSettingsModel } from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { AIAssistViewComponent, ToolbarSettingsModel, PromptRequestEventArgs } from '@syncfusion/ej2-react-interactive-chat';
import { gadgetsPurchaseData } from './datasource';
import { createRef } from "react";
import { onPromptExecute } from './AIModel';
import './assistive-grid.css';

let assistInstance!: AIAssistViewComponent;
let dialogInstance!: DialogComponent;
let gridInstance!:GridComponent;
let suggestionListRef = createRef<any>();
function AssistiveGrid() {
    
    /// <summary>Toolbar options for Grid with AI Assist button</summary>
    const toolbarOptions: object[] = [{ tooltipText: 'AI Assist', prefixIcon: 'e-assistview-icon', id: 'ai-assist-btn', align: 'Left' }];

    /// <summary>Handles the Grid toolbar button click action. If the AI Assist button clicked shows the AI Assist dialog.</summary>
    const toolbarClick = (args: any) => {
        if (args.item.id === 'ai-assist-btn') {
            const gridRect = gridInstance.element.getBoundingClientRect();
            const toolbarEleRect = document.getElementById('ai-grid_toolbarItems').getBoundingClientRect();
            const targetRect = args.originalEvent.target.closest('.e-toolbar-item').getBoundingClientRect();
            const x = (targetRect.left + targetRect.width) - gridRect.left;
            const y = (toolbarEleRect.top + toolbarEleRect.height) - gridRect.top;
            dialogInstance.position = { X: x, Y: y };
            dialogInstance.show();
        }
    }

    /// <summary>Configures toolbar settings for AI assist dialog</summary>
    const toolbarSettings: ToolbarSettingsModel  = {
        items: [
            { tooltip: 'Start New Chat', iconCss: 'e-icons e-rename', align: 'Right' },
            { tooltip: 'Clear', iconCss: 'e-icons e-refresh', align: 'Right' },
            { tooltip: 'Close', iconCss: 'e-icons e-icon-dlg-close', align: 'Right' },
        ],
        itemClicked: (args) => {
            if (args.item.iconCss === 'e-icons e-icon-dlg-close') {
                dialogInstance.hide()
            }
            if (args.item.iconCss === 'e-icons e-rename') {
                assistInstance.prompts = [];
            }
            if (args.item.iconCss === 'e-icons e-refresh') {
                assistInstance.prompts = [];
                gridInstance.setProperties({
                    sortSettings: { columns: [] },
                    filterSettings: { columns: [] },
                    groupSettings: { columns: [] },
                });
                gridInstance.refresh();
            }
        }
    };

    /// <summary>Renders response template for AI prompts</summary>
    const responseTemplate = (props: any) => {
        return (
            <div className="responseItemContent">
                <div className="response-header">
                    <span className="e-icons e-assistview-icon"></span>
                    {props.prompt}
                </div>
            </div>
        );
    };

    /// <summary>Handles prompt request execution</summary>
    const onPromptRequest = (args: PromptRequestEventArgs) => {
        (assistInstance as any).stopResponding.classList.remove('e-btn-active');
        assistInstance.scrollToBottom();
        var columns = gridInstance.columns.map((col: any) => {return {field: col.field}});
        columns.forEach((col: any) => {
            if (col.field === 'status') {
                col.values = ['Completed', 'Pending', 'Failed', 'Processing'];
            }
            else if (col.field === 'paymentMethod') {
                col.values = ['Cheque', 'Credit Card', 'Paypal', 'Online Transfer'];
            }
        })
        onPromptExecute(args.prompt, gridInstance, dialogInstance, assistInstance, columns);
    };

    /// <summary>Sets up suggestion list click handler</summary>
    const created = (): void => {
        suggestionListRef.current.addEventListener('click', (event: any) => {
            if (event.target.tagName === 'LI') {
                const clickedPill = event.target;
                const pillText = clickedPill.textContent;
                assistInstance.executePrompt(pillText);
            }
        });
    }

    /// <summary>Renders footer template with suggestion list</summary>
    const dialogFooterTemplate = () => {
        return (
            <div className="e-suggestions">
                <div className="e-suggestion-header">Suggestions</div>
                <div className="e-suggestion-list">
                    <ul ref={suggestionListRef}>
                        <li>Find iPhone 15 Pro</li>
                        <li>Sort Amount from lowest to highest</li>
                        <li>Payment status not completed</li>
                        <li>Sold quantity below 2</li>
                        <li>Clear Filtering</li>
                        <li>Clear Sorting</li>
                        <li>Remove Grouping</li>
                        <li>Group amount and status columns</li>
                        <li>Group status column</li>
                    </ul>
                </div>
            </div>
        );
    }

    const filterSettings: FilterSettingsModel = {type: 'Excel'};

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content'>
                        <p>Smart Grid</p>
                    </div>
                </div>
                <div id='container'>
                    <DialogComponent ref={(dialog: DialogComponent) => dialogInstance = dialog as DialogComponent} target='#ai-grid' id='ai-assist-dialog' width='500px' visible={false} height='500px' footerTemplate={dialogFooterTemplate} created={created}>
                    <AIAssistViewComponent id="ai-grid-aiassistview" ref={(assist: AIAssistViewComponent) => assistInstance = assist as AIAssistViewComponent} toolbarSettings={toolbarSettings} promptRequest={onPromptRequest} promptSuggestionsHeader='Suggestions' responseItemTemplate={responseTemplate} ></AIAssistViewComponent>
                </DialogComponent>
                <GridComponent ref = {(grid: GridComponent) => gridInstance = grid as GridComponent} id="ai-grid" height={650} dataSource={gadgetsPurchaseData} allowFiltering={true} allowSorting={true} allowGrouping={true} filterSettings={filterSettings} allowPaging={true} toolbar={toolbarOptions} toolbarClick={toolbarClick} >
                    <ColumnsDirective>
                        <ColumnDirective field="transactionId" headerText="Transaction ID" width="160"
                        />
                        <ColumnDirective field="customerD   etails.name" headerText="Customer Name" width="220" textAlign="Center"
                            template={(data: object) => (
                                <div >
                                    <p>{data.customerDetails.name}</p>
                                    <p className="email">{data.customerDetails.email}</p>
                                </div>
                            )} />
                        <ColumnDirective field="product.name" headerText="Product" width="208" textAlign="Left"
                        template={(data: object) => (
                                <div className='product-items'>
                                    <img className="rounded" src={`src/ai-components/grid/assistive-grid/sales-transactions-table/${data.product.image}`} width={40} height={40} alt="product image" />
                                    {/* src={data.product.image ? `/sales-transactions-table/${data.product.image}` : '/sales-transactions-table/fallback-image.jpg'} */}
                                    <p>{data.product.name}</p>
                                </div>
                            )}
                        />
                        <ColumnDirective field="quantity" headerText="Quantity" width="140" textAlign="Right" />
                        <ColumnDirective field="amount" headerText="Amount" width="130" format="c2" textAlign="Right" />
                        <ColumnDirective field="date" headerText="Purchase Date" width="180" format={{ type: "date", format: "MM/dd/yyyy" }} textAlign="Right" />
                        <ColumnDirective field="paymentMethod" headerText="Payment Method" width="200" />
                        <ColumnDirective field="status" headerText="Status" width="120" textAlign='Right'
                            template={(data: object) => (
                                <div >
                                    <span className={`e-badge ${data.status === "Completed" ? "e-badge-success" : data.status === "Pending" ? "e-badge-info" : data.status === "Processing" ? "e-badge-warning" : data.status === "Failed" ? "e-badge-danger" : ""} !px-2`}>{data.status}</span>
                                </div>
                            )}
                        />
                    </ColumnsDirective>
                    <Inject services={[Toolbar, Sort, Filter, Group, Page, Search]} />
                </GridComponent>
                </div>
            </div>
        </div>
    )
}

export default AssistiveGrid;
