import { TodoAPI } from '../app.component';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface TodoMessagingAPI {
    event: string;
    msg: number | string | Array<TodoAPI>;
}

@Injectable({
  providedIn: 'root',
})
export class MessagingService extends Subject<TodoMessagingAPI> {
}
