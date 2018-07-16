import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { concatMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    serverUrl = 'http://mealplanner.axilious.com';

    // FOR DEBUGGING PURPOSES ONLY
    // serverUrl = 'http://localhost:8080';

    headers = new HttpHeaders().append('Content-Type', 'application/json');
    private authToken = '';
    accountId = '';
    memberId = '';
    errorText = '';

    constructor(private http: HttpClient, private router: Router) {
    }

    registerUser(name: string, email: string, password: string) {
        return this.http.post(this.serverUrl + '/api/v1/accounts', {'email': email}, {
            observe: 'response',
            headers: this.headers
        }).pipe(
                map((resp: HttpResponse<string>) => {
                    this.accountId = resp.headers.get('Location').split('/api/v1/accounts/')[1];
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
                    return resp.headers.get('X-Auth-Token');
                }),
                concatMap((token) => this.http.post(this.serverUrl + '/api/v1/members', {'name': name},
                    {observe: 'response', headers: this.headers.append('X-Auth-Token', token)}))

            ).subscribe((location) => {
                this.memberId = location.headers.get('Location').split('/api/v1/members/')[1];
                console.log('Successfully registered!');
                this.router.navigate(['/login']);
            }
            );
        // TODO error handling, including duplicate email registrations

    }

    loginUser(email: string, password: string) {
        return this.http.post(this.serverUrl + '/api/v1/session',
            {
                'email': email,
                'password': password,
                'rememberMe': false
            }, {observe: 'response', headers: this.headers})
                .subscribe((resp) => {
                    this.authToken = resp.headers.get('X-Auth-Token');
                    this.router.navigate(['/']);
                    console.log('Logged in --> ' + resp.headers.get('X-Auth-Token'));
                },
                    (error) => {
                        this.errorText = error.statusText;
                    });
    }

    logoutUser() {
        return this.http.delete(this.serverUrl + '/api/v1/session', {
            headers: new HttpHeaders().append('X-Auth-Token', this.authToken)
        }).subscribe(() => {
            this.authToken = '';
            console.log('Logged out! Token is -->' + this.authToken);
            this.router.navigate(['/']);
        });
    }

    isAuthenticated() {
        return this.authToken !== '';
    }

    getToken() {
        return this.authToken;
    }

    // updatePassword(password: string) {
    //     console.log('updatePassword() PRC --> ' + this.user.prc);
    //     return this.http.put(this.serverUrl + '/api/v1/accounts/password/reset/' + this.user.prc,
    //         {'password': password},
    //         {headers: this.headers}
    //         )
    //         .subscribe((resp: HttpResponse<string>) => {
    //             console.log('Password updated!');
    //         });
    // }
    //
    // createMember(name: string) {
    //     return this.http.post(this.serverUrl + '/api/v1/members', {'name': name},
    //         {headers: this.headers.append('X-Auth-Token', this.user.token)})
    //         .subscribe((resp: HttpResponse<string>) => {
    //             console.log('Member created!');
    //
    //             // TODO parse memberId from headers
    //             // TODO error handling
    //         });
    //
    //
    // }


}
