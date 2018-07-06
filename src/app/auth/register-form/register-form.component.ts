import { Component } from '@angular/core';
import { User } from '../../user';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component( {
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: [ './register-form.component.css' ]
} )
export class RegisterFormComponent {

    constructor (private authService: AuthService) { }

    onRegister(form: NgForm) {
        this.authService.registerUser(form.value.name, form.value.email, form.value.password);
        // this.authService.updatePassword(form.value.password);
        // this.authService.createMember(form.value.name);
    }
}
