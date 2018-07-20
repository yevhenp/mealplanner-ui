import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MessageService } from '../../shared/message.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, OnDestroy {
    error = '';
    errorSub: Subscription;

    constructor(private authService: AuthService, private msgService: MessageService) {
    }

    ngOnInit() {
        this.errorSub = this.msgService.msg.subscribe(
            (msg: string) => {
                this.error = msg;
                if (this.error !== '') {
                    console.log(this.error);
                }
            }
        );
    }

    onLogin(form: NgForm) {
        this.authService.loginUser(form.value.email, form.value.password);
    }

    ngOnDestroy() {
        this.errorSub.unsubscribe();
    }
}
