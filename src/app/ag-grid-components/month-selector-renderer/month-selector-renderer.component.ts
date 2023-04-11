import {Component} from "@angular/core";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams, GridApi,  IRowNode} from "ag-grid-community";
import { MessagingService } from '../../messaging-service/messaging.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
   selector: 'month-selector-renderer',
   styleUrls: ['./month-selector-renderer.component.scss'],
   templateUrl: './month-selector-renderer.component.html'
})
export class MonthSelectorRenderer implements ICellRendererAngularComp {
    private gridApi = <GridApi>{};
    private monthOffset = 0;
    dateTimeFormControl: FormControl = new FormControl();
    dateTimeValue = '';
    monthLabel = moment().format('MMMM');

    constructor(private messagingService: MessagingService){

    }

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.gridApi = params.api;
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        return true;
    }

    getNextMonth(){
        this.monthOffset++;
        this.monthLabel = moment().add(this.monthOffset, 'month').format('MMMM');
        this.messagingService.next(this.monthOffset);
    }

    getPrevMonth(){
        this.monthOffset--;
        this.monthLabel = moment().add(this.monthOffset, 'month').format('MMMM');
        this.messagingService.next(this.monthOffset);
    }
}
