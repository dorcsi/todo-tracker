import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClassParams, CellClickedEvent, CellStyle, ColDef, GridReadyEvent } from 'ag-grid-community';
import { DeleteRowRenderer } from './ag-grid-components/delete-row-renderer/delete-row-renderer.component';
import { DateTimeRenderer } from './ag-grid-components/date-time-renderer/date-time-renderer.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'todo-project';

    private agGrid: any;

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
            return { background: 'lightblue' }
        }
    }
}
