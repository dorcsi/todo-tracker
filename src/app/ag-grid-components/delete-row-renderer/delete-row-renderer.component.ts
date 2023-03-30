import {Component} from "@angular/core";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams, GridApi,  IRowNode} from "ag-grid-community";

@Component({
   selector: 'delete-row-renderer',
   styleUrls: ['./delete-row-renderer.component.scss'],
   template: `
         <i (click)="buttonClicked()" class="fa-solid fa-trash"></i>
   `
})
export class DeleteRowRenderer implements ICellRendererAngularComp {
    private gridApi = <GridApi>{};
    private rowNode = <IRowNode>{};

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.gridApi = params.api;
        this.rowNode = params.node;
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        return true;
    }

    buttonClicked() {
        if (window.confirm(`Do you really want to remove this item? ${this.rowNode.data.task}`)) {
            this.gridApi.applyTransaction({remove: [this.rowNode.data]});
        }
    }
}
