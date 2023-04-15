import { Component, OnInit, Input } from '@angular/core';
import { CellClassParams, CellClickedEvent, CellStyle, ColDef, GridReadyEvent, ValueFormatterParams, GridApi, ColGroupDef, CellMouseOverEvent } from 'ag-grid-community';
import { TodoAPI } from '../../app.component'
import { MonthSelectorRenderer } from './../../ag-grid-components/month-selector-renderer/month-selector-renderer.component';
import { MessagingService, MESSAGETYPES } from '../../messaging-service/messaging.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
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
    styleUrls: ['./calendar-view.component.scss'],
    templateUrl: './calendar-view.component.html'
})
export class CalendarViewComponent implements OnInit {
    private gridApi!: GridApi;
    private taskCnt: any;
    rowData!: Array<CalendarDates>;
    frameworkComponents!: any;
    private monthOffset = 0;
    private readonly _unsubscribeMonthChange = new Subject<number>();
    private readonly _unsubscribeRowDelete = new Subject<number>();
    private readonly _unsubscribeRowAdd = new Subject<number>();
    private readonly _unsubscribeTableReset = new Subject<number>();

    public columnDefs: ColGroupDef[] = [
        {
            headerName: 'April',
            headerGroupComponent: 'monthSelectorRenderer',
            children: [
                { field: 'monday', headerName: 'Mon', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'tuesday', headerName: 'Tue', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'wednesday', headerName: 'Wed', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'thursday', headerName: 'Thu', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'friday', headerName: 'Fri', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'saturday', headerName: 'Sat', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() },
                { field: 'sunday', headerName: 'Sun', cellStyle: this.getCellStyle(), valueFormatter: this.getValueFormatter() }
            ]
        }
    ];

    public defaultColDef: ColDef = {
        sortable: false,
        filter: false,
        editable: false,
        width: 70
    };

    constructor(private messagingService: MessagingService){
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.MONTH_CHANGE_EVENT), takeUntil(this._unsubscribeMonthChange)).subscribe(x => {
            this.monthOffset = x.msg as number;
            this.fillDayCells(this.monthOffset);
        });
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.DELETE_ROW_EVENT), takeUntil(this._unsubscribeRowDelete)).subscribe(x => {
            this.taskCnt[(x.msg as string).split('T')[0]]--;
            this.gridApi.redrawRows();
        });
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.ADD_ROW_EVENT), takeUntil(this._unsubscribeRowAdd)).subscribe(x => {
            const date = (x.msg as string).split('T')[0];
            this.taskCnt[date] = (this.taskCnt[date] ?? 0) + 1;
            this.gridApi.redrawRows();
        });
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.RESET_TABLE_EVENT), takeUntil(this._unsubscribeTableReset)).subscribe(x => {
            this.countTasks(x.msg as Array<TodoAPI>);
            this.gridApi.redrawRows();
        });
    }

    ngOnInit() {
        this.frameworkComponents = {
            'monthSelectorRenderer': MonthSelectorRenderer
        }
    }

    ngOnDestroy() {
        this._unsubscribeMonthChange.complete();
        this._unsubscribeRowDelete.complete();
        this._unsubscribeRowAdd.complete();
        this._unsubscribeTableReset.complete();
    }

    private countTasks(data: Array<TodoAPI>) {
        this.taskCnt = {};
        data.forEach(todo => {
            const date = todo.deadline.split('T')[0];
            this.taskCnt[date] = (this.taskCnt[date] ?? 0) + 1;
        });
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
            if(!this.taskCnt){
                return style;
            }
            if(params.value.split('-')[1] !== moment().add(this.monthOffset, 'month').format('MM')){
                style['color'] = '#C8C8C8';
            }
            if(params.value === moment().format('YYYY-MM-DD')){
                style['border'] = '1px solid';
                style['font-weight'] = 'bold';
            }
            if(![undefined, 0].includes(this.taskCnt[params.value.split('T')[0]])){
                switch(this.taskCnt[params.value.split('T')[0]]){
                    case 4: {style['background'] = '#f0ec4f'; break;}
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

    onCellMouseOver(params: CellMouseOverEvent) {
        this.messagingService.next({event: MESSAGETYPES.DATE_HOVER_EVENT, msg: params.value});
    }
}
