import {Component} from "@angular/core";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams, GridApi,  IRowNode} from "ag-grid-community";
import * as moment from 'moment';

@Component({
   selector: 'delete-row-renderer',
   styleUrls: ['./delete-row-renderer.component.scss'],
   template: `
         <i (click)="buttonClicked()" [ngClass]="{'fa-plus': isPinnedRow, 'fa-trash': !isPinnedRow }" class="fa-solid"></i>
   `
})
export class DeleteRowRenderer implements ICellRendererAngularComp {
    private gridApi = <GridApi>{};
    private rowNode = <IRowNode>{};

    isPinnedRow = false;

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.gridApi = params.api;
        this.rowNode = params.node;
        this.isPinnedRow = params.node.isRowPinned();
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        return true;
    }

    buttonClicked() {
        if (this.isPinnedRow){
            this.gridApi.applyTransaction({add: [this.rowNode.data]});
            this.gridApi.setPinnedTopRowData([{deadline: moment().format('YYYY-MM-DDTHH:mm')}]);
        }
        else if (window.confirm(`Do you really want to remove this item? ${this.rowNode.data.task}`)) {
            this.gridApi.applyTransaction({remove: [this.rowNode.data]});
        }
    }
}
