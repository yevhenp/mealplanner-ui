import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    msg = new Subject<string>();

    constructor() {
    }

    pushMessage(error: HttpResponse<any>) {
        if (Math.floor(error.status / 100) === 2) {
            this.msg.next('');
        } else {
            switch (error.status) {
                case 400:
                    // Bad request
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
                case 401:
                    // Unauthorized
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
                case 402:
                    // Payment required
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
                case 403:
                    // Forbidden
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
                case 404:
                    // Not found
                    this.msg.next('This user was not found');
                    break;
                case 409:
                    // Conflict
                    this.msg.next('An account with this email has already been registered');
                    break;
                case 412:
                    // Precondition failed
                    this.msg.next('Another member just modified this resource -- please reload the page and try again');
                    break;
                case 428:
                    // Precondition required
                    this.msg.next('E-tag / If-Unmodified-Since header is missing (tell the devs)!!!');
                    break;
                case 500:
                    // Internal server error
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
                case 501:
                    // Not implemented
                    this.msg.next(error['error']['_embedded']['notifications'][0].message);
                    break;
            }
        }
    }
}
