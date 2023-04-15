import { TodoAPI } from '../app.component';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface TodoMessagingAPI {
    event: string;
    msg: number | string | Array<TodoAPI>;
}

export enum MESSAGETYPES{
    RESET_TABLE_EVENT = 'resetTableEvent',
    ADD_ROW_EVENT = 'addRowEvent',
    DELETE_ROW_EVENT = 'deleteRowEvent',
    MONTH_CHANGE_EVENT = 'monthChangeEvent',
    DATE_HOVER_EVENT = 'dateHoverEvent'
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService extends Subject<TodoMessagingAPI> {
}
