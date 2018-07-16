import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth/auth.service';
import { AccountService } from './shared/account.service';
import { HomeComponent } from './home/home.component';
import { MembersModule } from './members/members.module';
import { StoresModule } from './stores/stores.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        AuthModule,
        MembersModule,
        StoresModule
    ],
    providers: [AuthService, AccountService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
