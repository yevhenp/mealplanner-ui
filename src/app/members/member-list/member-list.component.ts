import { Component, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../member.model';
import { MemberService } from '../member.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from '../../shared/message.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-members-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {
    members: Member[] = [];
    error = '';
    listSub: Subscription;
    errorSub: Subscription;

    constructor(private memberService: MemberService, private msgService: MessageService, private authService: AuthService) {
    }

    ngOnInit() {
        this.memberService.fetchMembers();

        this.listSub = this.memberService.listUpdated.subscribe(
            (members: Member[]) => {
                this.members = members;
            }
        );

        this.errorSub = this.msgService.msg.subscribe(
            (msg: string) => {
                this.error = msg;
                if (this.error !== '') {
                    console.log(this.error);
                }
            }
        );
    }

    onAddMember(form: NgForm) {
        this.memberService.addMember(form.value.name);
    }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.errorSub.unsubscribe();
    }
}
