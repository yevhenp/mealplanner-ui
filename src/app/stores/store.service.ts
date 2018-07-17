import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Store } from './store.model';
import { map } from 'rxjs/operators';
import { MessageService } from '../shared/message.service';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    // TODO: CANNOT DELETE STORE (500 - Internal Server Error)

    private stores: Store[] = [];
    listUpdated = new Subject<Store[]>();

    storesUrl = 'http://mealplanner.axilious.com/api/v1/stores';

    // FOR DEBUGGING PURPOSES ONLY
    // storesUrl = 'http://localhost:8080/api/v1/stores';

    constructor(private http: HttpClient, private authService: AuthService, private msgService: MessageService) {
    }

    private getAuthToken() {
        return new HttpHeaders().set('X-Auth-Token', this.authService.getToken());
    }

    fetchStores() {
        this.stores = [];
        this.http.get(this.storesUrl, {headers: this.getAuthToken()})
            .pipe(map((resp) => {
                // Returning actual array of stores (JSON objects)
                if (resp['page']['totalElements'] === 0) {
                    return [];
                } else {
                    return resp['_embedded']['stores'];
                }
            }))
            .subscribe((stores) => {
                console.log('Fetched stores...');
                console.log(stores);

                for (const store of stores) {
                    const guy = new Store(store.name, store.storeId, store.status, new Date());
                    this.addStoreToList(guy);
                }
            });
    }

    addStore(storeName: string) {
        const headers = this.getAuthToken().append('Content-Type', 'application/json');
        this.http.post(this.storesUrl, {'name': storeName}, {observe: 'response', headers: headers})
            .subscribe((resp) => {
                    const id = resp.headers.get('Location').split('/api/v1/stores/')[1];
                    const store = new Store(storeName, id, 'ACTIVE', new Date());
                    this.addStoreToList(store);
                    this.msgService.pushStatusCode(resp.status);

                    console.log('Created new store...');
                    console.log(store);
                },
                (error) => {
                    this.msgService.pushStatusCode(error.status);
                });
    }

    deleteStore(storeId: string, index: number) {
        this.http.delete(this.storesUrl + '/' + storeId, {observe: 'response', headers: this.getAuthToken()})
            .subscribe((resp) => {
                    this.deleteStoreFromList(index);
                    this.msgService.pushStatusCode(resp.status);
                    console.log('Successfully deleted store!');
                },
                (error) => {
                    this.msgService.pushStatusCode(error.status);
                });
    }

    editStore(store: Store, newName: string, index: number) {
        const headers = this.getAuthToken().append('Content-Type', 'application/merge-patch+json')
            .append('If-Unmodified-Since', store.lastRetrieved.toUTCString());
        this.http.patch(this.storesUrl + '/' + store.id, {'name': newName}, {observe: 'response', headers: headers})
            .subscribe((resp: HttpResponse<any>) => {
                    this.editStoreInList(index, newName, new Date());
                    this.msgService.pushStatusCode(resp.status);
                    console.log('Updated name to: ' + newName);
                },
                (error) => {
                    this.msgService.pushStatusCode(error.status);
                });
    }

    private addStoreToList(store: Store) {
        this.stores.push(store);
        this.listUpdated.next(this.stores.slice());
    }

    private deleteStoreFromList(index: number) {
        this.stores.splice(index, 1);
        this.listUpdated.next(this.stores.slice());
    }

    private editStoreInList(index: number, newName: string, timeChanged: Date) {
        this.stores[index].name = newName;
        this.stores[index].lastRetrieved = timeChanged;
        this.listUpdated.next(this.stores.slice());
    }


}
