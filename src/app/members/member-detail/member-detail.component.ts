import { Component, OnInit } from '@angular/core';
import { Member } from '../member.model';
import { MemberService } from '../member.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    selectedMember: Member;

    constructor(private memberService: MemberService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.selectedMember = this.memberService.getMemberByIndex(+params['id']);
            });

        this.memberService.fetchSpecificMember(this.selectedMember.id)
            .subscribe(() => {
            });
    }

}
