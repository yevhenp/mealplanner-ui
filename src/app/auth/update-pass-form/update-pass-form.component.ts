import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../shared/message.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-update-pass-form',
    templateUrl: './update-pass-form.component.html',
    styleUrls: ['./update-pass-form.component.css']
})
export class UpdatePassFormComponent implements OnInit, OnDestroy {
    error = '';
    errorSub: Subscription;

    constructor(private authService: AuthService, private msgService: MessageService, private route: ActivatedRoute) {
    }

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

    onUpdate(form: NgForm) {
        const prc = this.route.params['value']['prc'];
        this.authService.updatePassword(form.value.password, prc);
    }

    ngOnDestroy() {
        this.errorSub.unsubscribe();
    }

}
