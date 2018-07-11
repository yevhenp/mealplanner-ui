import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

    constructor(public authService: AuthService) {
    }

    onLogin(form: NgForm) {
        this.authService.loginUser(form.value.email, form.value.password);
    }

}
