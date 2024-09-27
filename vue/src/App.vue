<template>
    <ejs-appbar id="e-header">
        <ejs-button id='regularButtonMenu' cssClass="e-inherit menu" iconCss="e-icons e-menu"
            @click="hamburgerClick"></ejs-button>
        <span class="regular" style="font-weight: bold;">Syncfusion Vue AI Samples</span>
        <div class="e-appbar-spacer"></div>
    </ejs-appbar>
    <div id="control-panel">
        <div id="right-pane">
            <router-view />
        </div>
    </div>
    <ejs-sidebar ref="leftpane" id="left-pane" class="default-sidebar" width="260px" target="#control-panel" type="Auto"
        position="Left">
        <ejs-treeview id='flat-list' nodeTemplate="nodeTemplate" :fields='fields' :dataSource='dataSource'>
            <template #nodeTemplate="{ data }">
                <router-link v-if="data.path" :to="data.path">{{ data.name }}</router-link>
                <span v-else>{{ data.name }}</span>
            </template>
        </ejs-treeview>
    </ejs-sidebar>
</template>

<script>
import { SidebarComponent, AppBarComponent } from '@syncfusion/ej2-vue-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-vue-navigations';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import data from './sample.json'
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);

export default {
    name: "App",
    components: {
        "ejs-sidebar": SidebarComponent,
        "ejs-treeview": TreeViewComponent,
        'ejs-appbar': AppBarComponent,
        'ejs-button': ButtonComponent
    },
    data() {
        return {
            fields: { dataSource: data, text: 'name', id: 'id', child: 'children', navigateURL: "path" },
            dataSource: data
        };
    },
    methods: {
        hamburgerClick: function () {
            this.$refs.leftpane.toggle();
        },
        
    }
}
</script>