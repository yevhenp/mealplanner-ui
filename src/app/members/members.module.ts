import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberService } from './member.service';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberItemComponent } from './member-item/member-item.component';
import { FormsModule } from '@angular/forms';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AppRoutingModule
    ],
    declarations: [MemberListComponent, MemberItemComponent, MemberDetailComponent],
    providers: [MemberService]
})
export class MembersModule {
}
