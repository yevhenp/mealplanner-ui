import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../shared/message.service';
import { Subscription } from 'rxjs';

@Component( {
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: [ './register-form.component.css' ]
} )
export class RegisterFormComponent implements OnInit, OnDestroy {
    error = '';
    errorSub: Subscription;

    constructor (public authService: AuthService, private msgService: MessageService) { }

    ngOnInit() {
        this.errorSub = this.msgService.msg.subscribe(
            (msg: string) => {
                this.error = msg;
                if (this.error !== '') {
                    console.log('Error code: ' + this.error);
                }
            }
        );
    }

    onRegister(form: NgForm) {
        this.authService.registerUser(form.value.name, form.value.email);
    }

    ngOnDestroy() {
        this.errorSub.unsubscribe();
    }
}
