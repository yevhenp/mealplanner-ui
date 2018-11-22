import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { AuthGuard } from './auth/auth-guard.service';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { StoreListComponent } from './stores/store-list/store-list.component';
import { UpdatePassFormComponent } from './auth/update-pass-form/update-pass-form.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginFormComponent},
    {path: 'register', component: RegisterFormComponent},
    {
        path: 'members', component: MemberListComponent, canActivate: [AuthGuard], children: [
            {path: ':id', component: MemberDetailComponent}
        ]
    },
    {path: 'stores', component: StoreListComponent, canActivate: [AuthGuard]},
    {path: 'accounts/password/reset/:prc', component: UpdatePassFormComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
