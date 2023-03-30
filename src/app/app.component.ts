import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClassParams, CellClickedEvent, CellStyle, ColDef, GridReadyEvent } from 'ag-grid-community';
import { DeleteRowRenderer } from './ag-grid-components/delete-row-renderer/delete-row-renderer.component';
import { DateTimeRenderer } from './ag-grid-components/date-time-renderer/date-time-renderer.component';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'todo-project';

    private agGrid: any;
    private fileReader = new window.FileReader();

    // Each Column Definition results in one Column.
    public columnDefs: ColDef[] = [
        { field: 'deadline', headerName: 'Deadline', cellRenderer: DateTimeRenderer },
        { field: 'task', cellStyle: this.getCellStyle() },
        { field: 'location' },
        { field: 'blocker' },
        { field: 'isDone', headerName: '', width: 15, cellRenderer: DeleteRowRenderer }
    ];

    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
    };

    rowData = [
        { deadline: "2023-03-23T09:30", task: "Boarding", location: 'BP Airport', blocker: '' },
        { deadline: "2023-03-23T11:00", task: "Landing", location: 'LN Luton' },
        { deadline: "2123-03-25T10:00", task: "Visit the British Museum", location: 'London' }
    ];

    // Example load data from server
    onGridReady(params: GridReadyEvent) {
        this.agGrid = params.api;
    }

    // Example of consuming Grid Event
    onCellClicked(e: CellClickedEvent): void {
        console.log('cellClicked', e);
    }

    getCellStyle() {
        return (params: CellClassParams): CellStyle => {
            let m = moment(params.data.deadline);
            let mt = moment();
            if(m < moment()){
                return { background: '#d49b87' }
            }
            return { background: 'lightblue' }
        }
    }

     openFile(){
        (<HTMLElement>document.querySelector('input[name="fileInput"]'))!.click();
    }

    handle(event: any){
        if(event.target.files.length > 0)
        {
            this.fileReader.readAsText(event.target.files[0]);
            this.fileReader.onloadend = (event) => {
                this.rowData = JSON.parse(event.target!.result! as string);
            }
        }
    }
}
