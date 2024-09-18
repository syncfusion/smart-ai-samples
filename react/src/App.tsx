import { Outlet } from "react-router-dom";
import { ItemDirective, ItemsDirective, SidebarComponent, ToolbarComponent } from '@syncfusion/ej2-react-navigations';
import LeftPane from './left-pane';
import './App.css'

function App() {
  let sidebarObj: SidebarComponent;
  const target: string = '.main-content';
  const title: string = '<div class="sample-name"><strong>Syncfusion React AI Samples</strong></div>';

  function toolbarClicked(args: any) {
    if (args.item.tooltipText == "Controls") {
      sidebarObj.toggle();
    }
  }

  return (
    <>
      <div id="container">
        <div>
          <ToolbarComponent id="menuToolbar" clicked={toolbarClicked}>
            <ItemsDirective>
              <ItemDirective id="menu-toggle" prefixIcon="e-icons e-menu" tooltipText="Controls"></ItemDirective>
              <ItemDirective template={title}></ItemDirective>
            </ItemsDirective>
          </ToolbarComponent>
        </div>
        <div className='main-content'>
          <SidebarComponent id="home-sidebar" ref={Sidebar => (sidebarObj as any) = Sidebar} width={'270px'}
            target={target} isOpen={true} type='Auto'>
            <LeftPane />
          </SidebarComponent>
          <div className='right-pane'>
            <div className='header-text'></div>
            <div id="content">
              {/* Routing content declaration */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
