import { Injectable } from '@angular/core';
import { Member } from './member.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MessageService } from '../shared/message.service';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    private members: Member[] = [];
    listUpdated = new Subject<Member[]>();

    membersUrl = 'http://mealplanner.axilious.com/api/v1/members';

    // FOR DEBUG PURPOSES ONLY
    // membersUrl = 'http://localhost:8080/api/v1/members';

    constructor(private http: HttpClient, private authService: AuthService, private msgService: MessageService) {
    }

    private getAuthToken() {
        return new HttpHeaders().set('X-Auth-Token', this.authService.getToken());
    }

    getMembers() {
        return this.members.slice();
    }

    getMemberByIndex(index: number) {
        return this.members[index];
    }

    fetchMembers() {
        this.members = [];
        this.http.get(this.membersUrl, {headers: this.getAuthToken()})
            .pipe(map((resp) => {

                // Returning actual array of members (JSON objects)
                return resp['_embedded']['members'];
            }))
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
        const headers = this.getAuthToken().append('Content-Type', 'application/json');
        this.http.post(this.membersUrl, {'name': memberName}, {observe: 'response', headers: headers})
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
                    console.log('why doesn\'t this create a fucking div?');
                    console.log('error status is ' + error.status);
                    console.log('error message is ' + error['error']['_embedded']['notifications'][0].message);
                    this.msgService.pushMessage(error);
                });
    }

    deleteMember(memberId: string, index: number) {
        this.http.delete(this.membersUrl + '/' + memberId, {observe: 'response', headers: this.getAuthToken()})
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
        const headers = this.getAuthToken().append('Content-Type', 'application/merge-patch+json')
            .append('If-Unmodified-Since', member.lastRetrieved.toUTCString());
        this.http.patch(this.membersUrl + '/' + member.id, {'name': newName}, {observe: 'response', headers: headers})
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
