import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginFormComponent},
    {path: 'register', component: RegisterFormComponent},
    {path: 'members', component: MemberListComponent, canActivate: [AuthGuard]}
];

@NgModule( {
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
} )
export class AppRoutingModule { }
