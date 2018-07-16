import { Component, OnInit, Input } from '@angular/core';
import { Member } from '../member.model';
import { MemberService } from '../member.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-member-item',
    templateUrl: './member-item.component.html',
    styleUrls: ['./member-item.component.css']
})
export class MemberItemComponent implements OnInit {
    @Input('listItem') member: Member;
    @Input() index: number;
    editMode = false;

    constructor(private memberService: MemberService) {
    }

    ngOnInit() {
    }

    onDelete() {
        this.memberService.deleteMember(this.member.id, this.index);
    }

    onEdit(form: NgForm) {
        this.memberService.editMember(this.member, form.value.name, this.index);
        this.editMode = false;
    }

}
