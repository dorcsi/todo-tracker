import { Component } from '@angular/core';
import { MessagingService, MESSAGETYPES } from './messaging-service/messaging.service';
import { GridApi } from 'ag-grid-community';

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
export class AppComponent {

    private fileReader = new window.FileReader();
    listGridApi!: GridApi<TodoAPI>;

    constructor(private messagingService: MessagingService){ }

    openFile(){
        (<HTMLElement>document.querySelector('input[name="fileInput"]'))!.click();
    }

    handleOpenFile(event: any){
        if(event.target.files.length > 0)
        {
            this.fileReader.readAsText(event.target.files[0]);
            this.fileReader.onloadend = (event) => {
                this.messagingService.next({event: MESSAGETYPES.RESET_TABLE_EVENT, msg: JSON.parse(event.target!.result! as string)});
            }
        }
    }

    saveFile() {
        (<any>document.getElementById('fileDownload')).href = this.getDownloadableContent();
        (<HTMLElement>document.getElementById('fileDownload'))!.click();
    }

    getDownloadableContent(){
        let rowData: Array<TodoAPI> = [];
        this.listGridApi?.forEachNode(node => rowData.push(node.data!));
        return "data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(rowData));
    }
}
