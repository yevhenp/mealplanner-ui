import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from '../shared/message.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    serverUrl = 'http://mealplanner.dev.axilious.com';

    // FOR DEBUGGING PURPOSES ONLY
    // serverUrl = 'http://localhost:8080';

    headers = new HttpHeaders().append('Content-Type', 'application/json');
    private authToken = '';
    memberId = '';

    constructor(private http: HttpClient, private router: Router, private msgService: MessageService, private cookie: CookieService) {
    }

    registerUser(name: string, email: string, /*password: string*/) {
        return this.http.post(this.serverUrl + '/api/v1/accounts', {'email': email}, {
            observe: 'response',
            headers: this.headers
        })
        .pipe(concatMap(() => {
            return this.http.post(this.serverUrl + '/api/v1/accounts/password/reset', {'email': email}, {
                observe: 'response',
                headers: this.headers
            });
        }))
        .subscribe();
    //     .pipe(
    //     map((resp: HttpResponse<string>) => {
    //         this.accountId = resp.headers.get('Location').split('/api/v1/accounts/')[1];
    //         return resp.headers.get('X-Auth-Prc');
    //     }),
    //     concatMap((prc) =>
    //         this.http.put(this.serverUrl + '/api/v1/accounts/password/reset/' + prc,
    //             {'password': password},
    //             {headers: this.headers}
    //         )),
    //     concatMap(() => this.http.post(this.serverUrl + '/api/v1/session',
    //         {
    //             'email': email,
    //             'password': password,
    //             'rememberMe': false
    //         }, {observe: 'response', headers: this.headers}
    //     )),
    //     map((resp) => {
    //         return resp.headers.get('X-Auth-Token');
    //     }),
    //     concatMap((token) => this.http.post(this.serverUrl + '/api/v1/members', {'name': name},
    //         {observe: 'response', headers: this.headers.append('X-Auth-Token', token)}))
    // ).subscribe((location) => {
    //         this.memberId = location.headers.get('Location').split('/api/v1/members/')[1];
    //         console.log('Successfully registered!');
    //         this.router.navigate(['/login']);
    //     },
    //     (error) => {
    //         this.msgService.pushMessage(error);
    //     }
    // );
    }

    updatePassword(newPass: string, prc: string) {
        console.log(newPass);
        console.log(prc);
        return this.http.put(this.serverUrl + '/api/v1/accounts/password/reset/' + prc, {'password': newPass})
            .subscribe((resp) => {
                console.log(resp);
                this.router.navigate(['/']);
            });
    }

    loginUser(email: string, password: string, remember_me: string) {
        const remember = new HttpParams().set('remember-me', remember_me);
        return this.http.post(this.serverUrl + '/api/v1/session',
            {
                'email': email,
                'password': password,
            }, {observe: 'response', headers: this.headers, params: remember, withCredentials: true})
            .subscribe((resp) => {
                    console.log(resp);
                    this.authToken = resp.headers.get('X-MPPA-Auth-Token');
                    this.router.navigate(['/']);
                    this.msgService.pushMessage(resp);
                    console.log('Successfully logged in!');
                },
                (error) => {
                    this.msgService.pushMessage(error);
                });
    }

    logoutUser() {
        const token = new HttpHeaders().set('X-MPPA-Auth-Token', this.getToken());

        return this.http.delete(this.serverUrl + '/api/v1/session', {
            headers: token,
            withCredentials: true
        }).subscribe(() => {
            this.authToken = '';
            console.log('Successfully logged out!');
            this.router.navigate(['/']);
        });
    }

    isAuthenticated() {
        // console.log(this.authToken);
        // console.log(this.cookie.get('mppa-remember-me'));
        return (this.authToken !== '') || this.cookie.get('mppa-remember-me') !== '';
    }

    getToken() {
        return this.authToken;
    }
}
