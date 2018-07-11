import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component( {
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: [ './register-form.component.css' ]
} )
export class RegisterFormComponent {

    constructor (public authService: AuthService) { }

    onRegister(form: NgForm) {
        this.authService.registerUser(form.value.name, form.value.email, form.value.password);
    }
}
