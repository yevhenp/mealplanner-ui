import { Component, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../member.model';
import { MemberService } from '../member.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-members-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {
    members: Member[] = [];
    sub: Subscription;

    constructor(private memberService: MemberService) {
    }

    ngOnInit() {
        this.memberService.fetchMembers();

        this.sub = this.memberService.listUpdated.subscribe(
            (members: Member[]) => {
                this.members = members;
            }
        );
    }

    onAddMember(form: NgForm) {
        this.memberService.addMember(form.value.name);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
