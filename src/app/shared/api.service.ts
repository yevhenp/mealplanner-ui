import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://mealplanner.dev.axilious.com/api/v1/';

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    private getAuthToken() {
        return new HttpHeaders().set('X-MPPA-Auth-Token', this.authService.getToken());
    }

    fetch(component: string) {
        return this.http.get(this.baseUrl + component, {headers: this.getAuthToken(), withCredentials: true})
            .pipe(map((resp) => {
                // Returning actual array (of JSON objects)
                if (resp['page']['totalElements'] === 0) {
                    return [];
                } else {
                    return resp['_embedded'][component];
                }
            }));
    }

    // @param requestBody should be a valid JSON HTTP body payload
    add(component: string, requestBody: any) {
        const headers = this.getAuthToken().append('Content-Type', 'application/json');

        return this.http.post(this.baseUrl + component, requestBody, {
            observe: 'response',
            headers: headers,
            withCredentials: true
        });
    }

    delete(component: string, id: string) {
        return this.http.delete(this.baseUrl + component + '/' + id, {
            observe: 'response',
            headers: this.getAuthToken(),
            withCredentials: true
        });
    }

    // @param item should be a recognized list item Model
    // @param requestBody should be a valid JSON HTTP body payload
    edit(component: string, item: any, requestBody: any) {
        const headers = this.getAuthToken().append('Content-Type', 'application/merge-patch+json')
            .append('If-Unmodified-Since', item.lastRetrieved.toUTCString());
        return this.http.patch(this.baseUrl + component + '/' + item.id, requestBody, {
            observe: 'response',
            headers: headers,
            withCredentials: true
        });
    }

}
