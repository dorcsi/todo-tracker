import {Component} from "@angular/core";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams, GridApi,  IRowNode, Column} from "ag-grid-community";
import { FormControl } from '@angular/forms';
import { MessagingService } from '../../messaging-service/messaging.service';
import { TodoAPI } from '../../app.component'

@Component({
   selector: 'date-time-renderer',
   styleUrls: ['./date-time-renderer.component.scss'],
   templateUrl: './date-time-renderer.component.html'
   /*template: `
         <mat-form-field>
            <input matInput type="datetime-local" placeholder="start date">
        </mat-form-field>
   `*/
})
export class DateTimeRenderer implements ICellRendererAngularComp {
    private gridApi = <GridApi>{};
    private rowNode = <IRowNode>{};
    dateTimeFormControl: FormControl = new FormControl();
    dateTimeValue = '';

    constructor(private messagingService: MessagingService){
    }

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.gridApi = params.api;
        this.rowNode = params.node;
        this.dateTimeValue = params.value;
        this.dateTimeFormControl.setValue(this.dateTimeValue);
        this.dateTimeFormControl.valueChanges.subscribe(value => {
            this.rowNode.data.deadline = value;
        });
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        return true;
    }

    dateEditFinished(){
        this.gridApi.redrawRows({ rowNodes: [this.rowNode] });
        this.gridApi.onSortChanged();
        let rowData: Array<TodoAPI> = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        this.messagingService.next({event: 'resetTableEvent', msg: rowData});
    }
}
