import { Injectable } from '@angular/core';
import { Member } from './member.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';
import { MessageService } from '../shared/message.service';
import { ApiService } from '../shared/api.service';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private members: Member[] = [];
    listUpdated = new Subject<Member[]>();

    membersUrl = 'http://mealplanner.dev.axilious.com/api/v1/members';

    // FOR DEBUG PURPOSES ONLY
    // membersUrl = 'http://localhost:8080/api/v1/members';

    constructor(private http: HttpClient, private authService: AuthService, private msgService: MessageService, private api: ApiService) {
    }

    private getAuthToken() {
        return new HttpHeaders().set('X-MPPA-Auth-Token', this.authService.getToken());
    }

    getMemberByIndex(index: number) {
        return this.members[index];
    }

    fetchMembers() {
        this.members = [];

        this.api.fetch('members')
            .subscribe((members) => {
                console.log('Fetched members...');
                console.log(members);

                for (const member of members) {
                    const guy = new Member(member.name, member.memberId, member.status, new Date());
                    this.addMemberToList(guy);
                }
            });
    }

    fetchSpecificMember(id: string) {
        return this.http.get(this.membersUrl + '/' + id, {headers: this.getAuthToken()});
    }

    addMember(memberName: string) {
        const reqBody = {'name': memberName};

        this.api.add('members', reqBody)
            .subscribe((resp) => {
                    const id = resp.headers.get('Location').split('/api/v1/members/')[1];
                    const member = new Member(memberName, id, 'ACTIVE', new Date());
                    this.addMemberToList(member);
                    this.msgService.pushMessage(resp);

                    console.log('Created new member...');
                    console.log(member);
                },
                (error) => {
                    console.log(error);
                    this.msgService.pushMessage(error);
                });
    }

    deleteMember(memberId: string, index: number) {
        this.api.delete('members', memberId)
            .subscribe((resp) => {
                    this.deleteMemberFromList(index);
                    this.msgService.pushMessage(resp);
                    console.log('Successfully deleted member!');
                },
                (error) => {
                    this.msgService.pushMessage(error);
                });
    }

    editMember(member: Member, newName: string, index: number) {
        const reqBody = {'name': newName, 'status': 'ACTIVE'};

        this.api.edit('members', member, reqBody)
            .subscribe((resp) => {
                    this.editMemberInList(index, newName, new Date());
                    this.msgService.pushMessage(resp);
                    console.log('Updated name to: ' + newName);
                },
                (error) => {
                    this.msgService.pushMessage(error);
                });
    }

    private addMemberToList(mem: Member) {
        this.members.push(mem);
        this.listUpdated.next(this.members.slice());
    }

    private deleteMemberFromList(index: number) {
        this.members.splice(index, 1);
        this.listUpdated.next(this.members.slice());
    }

    private editMemberInList(index: number, newName: string, timeChanged: Date) {
        this.members[index].name = newName;
        this.members[index].lastRetrieved = timeChanged;
        this.listUpdated.next(this.members.slice());
    }
}
