import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClassParams, CellClickedEvent, CellStyle, ColDef, GridReadyEvent } from 'ag-grid-community';
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
        { field: 'deadline', headerName: 'Deadline', cellStyle: this.getCellStyle() },
        { field: 'task' },
        { field: 'location' },
        { field: 'blocker' },
        { field: 'isDone' }
    ];

    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
        sortable: true,
        filter: true,
    };

    rowData = [
        { deadline: "Toyota", task: "Celica", location: 35000, blocker: '' },
        { deadline: "Ford", task: "Mondeo", location: 32000 },
        { deadline: "Porsche", task: "Boxster", location: 72000 }
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
            return { background: 'blue' }
        }
    }

}
