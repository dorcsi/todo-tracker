import { Component, OnInit, Input } from '@angular/core';
import { CellClassParams, CellClickedEvent, CellStyle, ColDef, GridOptions, GridReadyEvent, ValueFormatterParams, GridApi, ColGroupDef } from 'ag-grid-community';
import { TodoAPI } from '../../app.component'
import { MonthSelectorRenderer } from './../../ag-grid-components/month-selector-renderer/month-selector-renderer.component';
import { MessagingService } from '../../messaging-service/messaging.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

export interface CalendarDates {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
}

@Component({
    selector: 'calendar-view',
    templateUrl: './calendar-view.component.html'
})
export class CalendarViewComponent implements OnInit {
    @Input() todoItems!: Array<TodoAPI>;
    private gridApi!: GridApi;
    private taskCnt: any;
    rowData!: Array<CalendarDates>;
    frameworkComponents!: any;
    private monthOffset = 0;
    private readonly _unsubscribeMonthChange = new Subject<number>();

    public columnDefs: ColGroupDef[] = [
        {
            headerName: 'April',
            headerGroupComponent: 'monthSelectorRenderer',
            children: [
                { field: 'monday', headerName: 'Monday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'tuesday', headerName: 'Tuesday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'wednesday', headerName: 'Wednesday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'thursday', headerName: 'Thursday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'friday', headerName: 'Friday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'saturday', headerName: 'Saturday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'sunday', headerName: 'Sunday', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() }
            ]
        }
    ];

    public defaultColDef: ColDef = {
        sortable: false,
        filter: false,
        editable: false,
        width: 120
    };

    constructor(private messagingService: MessagingService){
        this.messagingService.pipe(takeUntil(this._unsubscribeMonthChange)).subscribe(x => {
            this.monthOffset = x;
            this.fillDayCells(x)
        });
    }

    ngOnInit() {
        this.frameworkComponents = {
            'monthSelectorRenderer': MonthSelectorRenderer
        }
        this.taskCnt = {};
        this.todoItems.forEach(todo => {
            const date = todo.deadline.split('T')[0];
            this.taskCnt[date] = (this.taskCnt[date] ?? 0) + 1;
        });
    }

    ngOnDestroy() {
        this._unsubscribeMonthChange.complete();
    }

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.fillDayCells(0);
    }

    fillDayCells(monthOffset = 0) {
        this.rowData = <any>[];
        [0, 1, 2, 3, 4].forEach(x => {
            this.rowData.push({})
        });
        this.rowData.forEach((x, weekOffset) => {
            x.monday = moment().add(monthOffset, 'month').startOf('month').day(1 + weekOffset * 7).format('YYYY-MM-DD');
            x.tuesday = moment().add(monthOffset, 'month').startOf('month').day(2 + weekOffset * 7).format('YYYY-MM-DD');
            x.wednesday = moment().add(monthOffset, 'month').startOf('month').day(3 + weekOffset * 7).format('YYYY-MM-DD');
            x.thursday = moment().add(monthOffset, 'month').startOf('month').day(4 + weekOffset * 7).format('YYYY-MM-DD');
            x.friday = moment().add(monthOffset, 'month').startOf('month').day(5 + weekOffset * 7).format('YYYY-MM-DD');
            x.saturday = moment().add(monthOffset, 'month').startOf('month').day(6 + weekOffset * 7).format('YYYY-MM-DD');
            x.sunday = moment().add(monthOffset, 'month').startOf('month').day(7 + weekOffset * 7).format('YYYY-MM-DD');
        });
        this.gridApi.setRowData(this.rowData);
    }

    getCellStyle() {
        return (params: CellClassParams): CellStyle => {
            let style = <CellStyle>{};
            if(params.value.split('-')[1] !== moment().add(this.monthOffset, 'month').format('MM')){
                style['color'] = 'lightgray';
            }
            if(params.value === moment().format('YYYY-MM-DD')){
                style['border'] = '1px solid';
                style['font-weight'] = 'bold';
            }
            if(this.taskCnt[params.value.split('T')[0]] !== undefined){
                switch(this.taskCnt[params.value.split('T')[0]]){
                    case 4: {style['background'] = '#e8df4f'; break;}
                    case 3: {style['background'] = '#e8e174'; break;}
                    case 2: {style['background'] = '#ebe69d'; break;}
                    case 1: {style['background'] = '#faf9ca'; break;}
                    default: style['background'] = '#f2e400';
                }
            }
            return style;
        }
    }

    getValueFormatter() {
        return (params: ValueFormatterParams): string => {
            return params.value.split('-')[2];
        }

    }
}
