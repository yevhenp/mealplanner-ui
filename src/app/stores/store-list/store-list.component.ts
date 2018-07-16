import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '../store.model';
import { NgForm } from '@angular/forms';
import { StoreService } from '../store.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-store-list',
    templateUrl: './store-list.component.html',
    styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit, OnDestroy {
    stores: Store[] = [];
    sub: Subscription;

    constructor(private storeService: StoreService) {
    }

    ngOnInit() {
        this.storeService.fetchStores();

        this.sub = this.storeService.listUpdated.subscribe(
            (stores: Store[]) => {
                this.stores = stores;
            });
    }

    onAddStore(form: NgForm) {
        this.storeService.addStore(form.value.name);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
