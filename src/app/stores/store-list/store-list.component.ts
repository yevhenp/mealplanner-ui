import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '../store.model';
import { NgForm } from '@angular/forms';
import { StoreService } from '../store.service';
import { Subscription } from 'rxjs';
import { MessageService } from '../../shared/message.service';

@Component({
    selector: 'app-store-list',
    templateUrl: './store-list.component.html',
    styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit, OnDestroy {
    stores: Store[] = [];
    error = '';
    listSub: Subscription;
    errorSub: Subscription;

    constructor(private storeService: StoreService, private msgService: MessageService) {
    }

    ngOnInit() {
        this.storeService.fetchStores();

        this.listSub = this.storeService.listUpdated.subscribe(
            (stores: Store[]) => {
                this.stores = stores;
            });
        this.errorSub = this.msgService.msg.subscribe(
            (msg: string) => {
                this.error = msg;
                if (this.error !== '') {
                    console.log('Error code: ' + this.error);
                }
            }
        );
    }

    onAddStore(form: NgForm) {
        this.storeService.addStore(form.value.name);
    }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.errorSub.unsubscribe();
    }
}
