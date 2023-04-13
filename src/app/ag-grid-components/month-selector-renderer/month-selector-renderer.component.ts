import {Component} from "@angular/core";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams, GridApi,  IRowNode} from "ag-grid-community";
import { MessagingService } from '../../messaging-service/messaging.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { throwError } from "rxjs";

export interface monthsAPI {
    name: string;
    offset: number;
}

@Component({
   selector: 'month-selector-renderer',
   styleUrls: ['./month-selector-renderer.component.scss'],
   templateUrl: './month-selector-renderer.component.html'
})
export class MonthSelectorRenderer implements ICellRendererAngularComp {
    private gridApi = <GridApi>{};
    private monthOffset = 0;
    private focusedMonth = moment().month();
    private focusedYear = moment().year();
    monthSelectorFormControl: FormControl = new FormControl();
    yearSelectorFormControl: FormControl = new FormControl();
    months = new Array<monthsAPI>();
    years = new Array<number>();

    constructor(private messagingService: MessagingService){
    }

    // gets called once before the renderer is used
    agInit(params: ICellRendererParams): void {
        this.gridApi = params.api;
        for(let i = 0; i < 12; i++){
            this.months.push({
                name: moment().month(i).format('MMMM'),
                offset: i
            });
        }
        for(let i = -1; i < 4; i++){
            this.years.push(moment().year(this.focusedYear + i).year());
        }
        this.monthSelectorFormControl.setValue(this.focusedMonth);
        this.monthSelectorFormControl.valueChanges.subscribe(value => {
            this.monthOffset += value - this.focusedMonth;
            this.focusedMonth = value;
            this.messagingService.next({event: 'monthChangeEvent', msg: this.monthOffset});
        });
        this.yearSelectorFormControl.setValue(this.focusedYear);
        this.yearSelectorFormControl.valueChanges.subscribe(value => {
            this.monthOffset += (value - this.focusedYear) * 12;
            this.focusedYear = value;
            this.messagingService.next({event: 'monthChangeEvent', msg: this.monthOffset});
        });
    }

    // gets called whenever the cell refreshes
    refresh(params: ICellRendererParams): boolean {
        return true;
    }

    getNextMonth(){
        this.monthOffset++;
        if(this.focusedMonth === 11){
            this.focusedMonth = 0;
            this.focusedYear++;
            this.yearSelectorFormControl.setValue(this.focusedYear);
        }
        else{
            this.focusedMonth++;
        }
        this.messagingService.next({event: 'monthChangeEvent', msg: this.monthOffset});
        this.monthSelectorFormControl.setValue(this.focusedMonth);
    }

    getPrevMonth(){
        this.monthOffset--;
        if(this.focusedMonth === 0){
            this.focusedMonth = 11;
            this.focusedYear--;
            this.yearSelectorFormControl.setValue(this.focusedYear);
        }
        else{
            this.focusedMonth--;
        }
        this.messagingService.next({event: 'monthChangeEvent', msg: this.monthOffset});
        this.monthSelectorFormControl.setValue(this.focusedMonth);
    }
}
