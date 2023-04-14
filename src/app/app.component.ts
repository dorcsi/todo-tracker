import { Component, OnInit } from '@angular/core';
import { CellClassParams, CellClickedEvent, CellStyle, RowStyle, RowClassParams, ColDef, GridOptions, GridReadyEvent, ValueFormatterParams, GridApi, ITooltipParams } from 'ag-grid-community';
import { DeleteRowRenderer } from './ag-grid-components/delete-row-renderer/delete-row-renderer.component';
import { DateTimeRenderer } from './ag-grid-components/date-time-renderer/date-time-renderer.component';
import { MessagingService, MESSAGETYPES } from './messaging-service/messaging.service';
import * as moment from 'moment';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import * as _ from 'lodash';

export interface TodoAPI {
    deadline: string,
    task: string,
    location: string,
    blocker?: string,
    taskDeleteCol?: string
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Todo Tracker';

    private gridApi!: GridApi;
    private fileReader = new window.FileReader();
    private readonly _unsubscribeDateHoverChange = new Subject<number>();
    private dateHovered!: string;
    gridOptions: GridOptions = {
        singleClickEdit: true,
        getRowStyle: this.getRowStyle(),
        tooltipShowDelay: 0
    };

    // Each Column Definition results in one Column.
    public columnDefs: ColDef[] = [
        { field: 'deadline', headerName: 'Deadline', cellRenderer: DateTimeRenderer, sort: 'asc', editable: false, width: 100 },
        { field: 'task', cellStyle: this.getCellStyle(), tooltipField: 'task' },
        { field: 'location' },
        { field: 'blocker', width: 80 },
        { field: 'taskDeleteCol', headerName: '', width: 15, editable: false, cellRenderer: DeleteRowRenderer }
    ];

    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        editable: true
    };

    rowData: TodoAPI[] = [
        { deadline: "2023-04-23T09:30", task: "Boarding", location: 'BP Airport', blocker: '' },
        { deadline: "2023-04-23T11:00", task: "Landing", location: 'LN Luton' },
        { deadline: "2023-04-25T11:00", task: "Landing", location: 'LN Luton' },
        { deadline: "2123-03-25T10:00", task: "Visit the British Museum", location: 'London' }
    ];

    constructor(private messagingService: MessagingService){
        this.messagingService.pipe(filter(x => x.event === MESSAGETYPES.DATE_HOVER_EVENT,), takeUntil(this._unsubscribeDateHoverChange)).subscribe(x => {
            this.dateHovered = x.msg as string;
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
    }

    // Example load data from server
    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.clearInputRow();
        this.gridApi.sizeColumnsToFit()
    }

    private clearInputRow() {
        this.gridApi.setPinnedTopRowData([{deadline: moment().format('YYYY-MM-DDTHH:mm')}]);
    }

    // Example of consuming Grid Event
    onCellClicked(e: CellClickedEvent): void {
        console.log('cellClicked', e);
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

    private getTooltipValue(params:any){
        return 'hi'
    }

    openFile(){
        (<HTMLElement>document.querySelector('input[name="fileInput"]'))!.click();
    }

    handleOpenFile(event: any){
        if(event.target.files.length > 0)
        {
            this.fileReader.readAsText(event.target.files[0]);
            this.fileReader.onloadend = (event) => {
                this.rowData = JSON.parse(event.target!.result! as string);
                this.messagingService.next({event: MESSAGETYPES.RESET_TABLE_EVENT, msg: this.rowData});
            }
        }
    }

    saveFile() {
        (<any>document.getElementById('fileDownload')).href = this.getDownloadableContent();
        (<HTMLElement>document.getElementById('fileDownload'))!.click();
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

    getDownloadableContent(){
        let rowData: Array<TodoAPI> = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        return "data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(rowData));
    }
}
