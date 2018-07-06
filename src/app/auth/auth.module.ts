import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  declarations: [
      RegisterFormComponent,
      LoginFormComponent
  ],
  imports: [
      CommonModule,
      FormsModule
  ],
  exports: [
      RegisterFormComponent,
      LoginFormComponent
  ]
})
export class AuthModule { }
