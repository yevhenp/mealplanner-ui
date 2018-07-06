import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, flatMap, concatMap } from 'rxjs/operators';
import { User } from '../user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    serverUrl = 'http://mealplanner.axilious.com';
    headers = new HttpHeaders().append('Content-Type', 'application/json');
    user = new User( '', '', '' , '', '');

    registerUser(name: string, email: string, password: string) {
        this.user.name = name;
        this.user.email = email;
        this.user.password = password;

        return this.http.post(this.serverUrl + '/api/v1/accounts', {'email': email}, {
            observe: 'response',
            headers: this.headers
        }).pipe(
                map((resp) => {
                    this.user.prc = resp.headers.get('X-Auth-Prc');
                    console.log('Mapped PRC --> ' + this.user.prc);
                    return resp.headers.get('X-Auth-Prc');
                }),
                concatMap((prc) =>
                    this.http.put(this.serverUrl + '/api/v1/accounts/password/reset/' + prc,
                    {'password': password},
                    {headers: this.headers}
                )),
                concatMap(() => this.http.post(this.serverUrl + '/api/v1/session',
                    {
                        'email': email,
                        'password': password,
                        'rememberMe': false
                    }, {observe: 'response', headers: this.headers}
                )),
                map((resp) => {
                    this.user.token = resp.headers.get('X-Auth-Token');
                    console.log('Mapped Token --> ' + this.user.token);
                    return this.user.token;
                }),
                concatMap(() => this.http.post(this.serverUrl + '/api/v1/members', {'name': name},
                    {headers: this.headers.append('X-Auth-Token', this.user.token)}))

            ).subscribe();




        //     .subscribe((resp: HttpResponse<string>) => {
        //     this.user.prc = resp.headers.get('X-Auth-Prc');
        //     console.log('In user object --> ' + this.user.prc);
        //     this.user.token = resp.headers.get('X-Auth-Token');
        //     console.log('In user object --> ' + this.user.token);
        //
        //     // TODO parse accountId from headers
        //     // TODO error handling
        // });
            // .pipe(map(
            //     (resp) => {
            //         console.log('From the response -->' + resp.headers.get('X-Auth-Prc'));
            //         return resp.headers.get('X-Auth-Prc');
            //     })
            // );
    }

    updatePassword(password: string) {
        console.log('updatePassword() PRC --> ' + this.user.prc);
        return this.http.put(this.serverUrl + '/api/v1/accounts/password/reset/' + this.user.prc,
            {'password': password},
            {headers: this.headers}
            )
            .subscribe((resp: HttpResponse<string>) => {
                console.log('Password updated!');
            });
    }

    createMember(name: string) {
        return this.http.post(this.serverUrl + '/api/v1/members', {'name': name},
            {headers: this.headers.append('X-Auth-Token', this.user.token)})
            .subscribe((resp: HttpResponse<string>) => {
                console.log('Member created!');

                // TODO parse memberId from headers
                // TODO error handling
            });


    }

    constructor(private http: HttpClient) {
    }
}
