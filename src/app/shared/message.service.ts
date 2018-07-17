import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    msg = new Subject<string>();

    constructor() {
    }

    pushStatusCode(status: number) {
        if (Math.floor(status / 100) === 2) {
            this.msg.next('');
        } else {
            switch (status) {
                case 400:
                    this.msg.next('Bad request');
                    break;
                case 401:
                    this.msg.next('Unauthorized');
                    break;
                case 402:
                    this.msg.next('Payment required');
                    break;
                case 403:
                    this.msg.next('Forbidden');
                    break;
                case 404:
                    this.msg.next('Not found');
                    break;
                case 409:
                    this.msg.next('Conflict');
                    break;
                case 500:
                    this.msg.next('Internal server error');
                    break;
                case 501:
                    this.msg.next('Not implemented');
                    break;
            }
        }
    }
}
