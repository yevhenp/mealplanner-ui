import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Store } from './store.model';
import { MessageService } from '../shared/message.service';
import { ApiService } from '../shared/api.service';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    private stores: Store[] = [];
    listUpdated = new Subject<Store[]>();

    storesUrl = 'http://mealplanner.dev.axilious.com/api/v1/stores';

    // FOR DEBUGGING PURPOSES ONLY
    // storesUrl = 'http://localhost:8080/api/v1/stores';

    constructor(private http: HttpClient, private authService: AuthService, private msgService: MessageService, private api: ApiService) {
    }

    private getAuthToken() {
        return new HttpHeaders().set('X-MPPA-Auth-Token', this.authService.getToken());
    }

    fetchStores() {
        this.stores = [];
        this.api.fetch('stores')
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
        const reqBody = {'name': storeName};
        this.api.add('stores', reqBody)
            .subscribe((resp) => {
                    const id = resp.headers.get('Location').split('/api/v1/stores/')[1];
                    const store = new Store(storeName, id, 'ACTIVE', new Date());
                    this.addStoreToList(store);
                    this.msgService.pushMessage(resp);

                    console.log('Created new store...');
                    console.log(store);
                },
                (error) => {
                    this.msgService.pushMessage(error);
                });
    }

    deleteStore(storeId: string, index: number) {
        this.api.delete('stores', storeId)
            .subscribe((resp) => {
                    this.deleteStoreFromList(index);
                    this.msgService.pushMessage(resp);
                    console.log('Successfully deleted store!');
                },
                (error) => {
                console.log(error);
                    this.msgService.pushMessage(error);
                });
    }

    editStore(store: Store, newName: string, index: number) {
        const reqBody = {'name': newName, 'status': 'ACTIVE'};
        this.api.edit('stores', store, reqBody)
            .subscribe((resp: HttpResponse<any>) => {
                    this.editStoreInList(index, newName, new Date());
                    this.msgService.pushMessage(resp);
                    console.log('Updated name to: ' + newName);
                },
                (error) => {
                    this.msgService.pushMessage(error);
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
