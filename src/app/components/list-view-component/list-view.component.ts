import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CellClassParams, CellStyle, RowStyle, RowClassParams, ColDef, GridOptions, GridReadyEvent, ValueFormatterParams, GridApi } from 'ag-grid-community';
import { TodoAPI } from '../../app.component'
import { DeleteRowRenderer } from 'src/app/ag-grid-components/delete-row-renderer/delete-row-renderer.component';
import { DateTimeRenderer } from 'src/app/ag-grid-components/date-time-renderer/date-time-renderer.component';
import { MessagingService, MESSAGETYPES } from '../../messaging-service/messaging.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'list-view',
    styleUrls: ['./list-view.component.scss'],
    templateUrl: './list-view.component.html'
})
export class ListViewComponent implements OnInit {
    private gridApi!: GridApi<TodoAPI>;
    private readonly _unsubscribeDateHoverChange = new Subject<number>();
    private readonly _unsubscribeTableReset = new Subject<number>();
    private dateHovered!: string;
    @Output() listGridApi: EventEmitter<GridApi> = new EventEmitter();

    gridOptions: GridOptions = {
        singleClickEdit: true,
        getRowStyle: this.getRowStyle(),
        tooltipShowDelay: 0
    };

    public columnDefs: ColDef[] = [
        { field: 'deadline', headerName: 'Deadline', cellRenderer: DateTimeRenderer, sort: 'asc', editable: false, width: 100 },
        { field: 'task', cellStyle: this.getCellStyle(), tooltipField: 'task' },
        { field: 'location' },
        { field: 'blocker', width: 80 },
        { field: 'taskDeleteCol', headerName: '', width: 15, editable: false, cellRenderer: DeleteRowRenderer }
    ];

    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true
    };

    rowData: TodoAPI[] = [];

    constructor(private messagingService: MessagingService){
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.DATE_HOVER_EVENT,), takeUntil(this._unsubscribeDateHoverChange)).subscribe(x => {
            this.dateHovered = x.msg as string;
            this.gridApi.redrawRows();
        });
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.RESET_TABLE_EVENT), takeUntil(this._unsubscribeTableReset)).subscribe(x => {
            this.rowData = (x.msg as Array<TodoAPI>);
            this.gridApi.redrawRows();
        });
    }

    ngOnInit() {
        this.columnDefs.forEach(colDef => {
            colDef.valueFormatter = this.getValueFormatter();
        });
    }

    ngOnDestroy() {
        this._unsubscribeDateHoverChange.complete();
        this._unsubscribeTableReset.complete();
    }

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.clearInputRow();
        this.gridApi.sizeColumnsToFit();
        this.listGridApi.emit(this.gridApi);
    }

    private clearInputRow() {
        this.gridApi.setPinnedTopRowData([{deadline: moment().format('YYYY-MM-DDTHH:mm')}]);
    }

    private getCellStyle() {
        return (params: CellClassParams): CellStyle => {
            if(params.node.isRowPinned()){
                return {};
            }
            let m = moment(params.data.deadline);
            if(m.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
                return { background: '#a9d6cc' }
            } else if(m < moment()){
                return { background: '#f7e4dc' }
            }
            return { background: '#d7f4fa' }
        }
    }

    private getRowStyle(){
        return (params: RowClassParams): RowStyle => {
            if(params.node.isRowPinned()){
                return {};
            }
            let m = moment(params.data.deadline).format('YYYY-MM-DD');
            if(m === this.dateHovered){
                return { background: 'lightgray' }
            }
            return {}
        }
    }

    private getValueFormatter = () => {
        return (params: ValueFormatterParams): string => {
            return this.isEmptyPinnedCell(params) ? '' : params.value
        };
    }

    private isEmptyPinnedCell(params: ValueFormatterParams) {
        return (
          (params.node?.rowPinned === 'top' && params.value == null) ||
          (params.node?.rowPinned === 'top' && params.value == '')
        );
    }
}
