import { GridComponent } from '@syncfusion/ej2-react-grids';
interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface Sort {
  field: string;
  direction: 'Ascending' | 'Descending';
}

interface Page {
  pageNumber: number;
  pageSize: number;
}

interface GridActionData {
  filter?: Filter[];
  clearFilter?: string[];
  sort?: Sort[];
  clearSort?: string[];
  page?: Page;
  group?: string[];
  clearGroup?: string[];
}
export const executeGridAction = (data: GridActionData, gridInstance: GridComponent) => {
    if (data.filter && data.filter.length) {
        data.filter.forEach((filter: Filter) => {
            gridInstance.filterByColumn(filter.field, filter.operator, filter.value);
        })
    }
    if (data.clearFilter) {
        if (data.clearFilter.length === 0) {
            gridInstance.clearFiltering();
        } else {
            gridInstance.clearFiltering(data.clearFilter);
        }
    }
    if (data.sort && data.sort.length) {
        data.sort.forEach((sort: Sort) => {
            gridInstance.sortColumn(sort.field, sort.direction, true);
        })
    }
    else if (data.clearSort) {
        gridInstance.clearSorting();
    }
    if (data.page && data.page.pageNumber && data.page.pageSize) {
        gridInstance.goToPage(data.page.pageNumber);
    }
    if (data.group && data.group.length) {
        var groupColumns = [...gridInstance.groupSettings.columns];
        if (groupColumns.indexOf(data.group[0]) === -1) {
            gridInstance.groupColumn(data.group[0]);
        }
    }
    if (data.clearGroup) {
        if (data.clearGroup.length === 0) {
            gridInstance.clearGrouping();
        } else {
            var groupColumns = [...gridInstance.groupSettings.columns];
            if (groupColumns.indexOf(data.clearGroup[0]) !== -1) {
                gridInstance.ungroupColumn(data.clearGroup[0]);
            }
        }
    }
}