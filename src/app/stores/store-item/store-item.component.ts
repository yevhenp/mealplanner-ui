import { Component, Input, OnInit } from '@angular/core';
import { Store } from '../store.model';
import { NgForm } from '@angular/forms';
import { StoreService } from '../store.service';

@Component({
    selector: 'app-store-item',
    templateUrl: './store-item.component.html',
    styleUrls: ['./store-item.component.css']
})
export class StoreItemComponent implements OnInit {
    @Input('listItem') store: Store;
    @Input() index: number;
    editMode = false;

    constructor(private storeService: StoreService) {
    }

    ngOnInit() {
    }

    onEdit(form: NgForm) {
        this.storeService.editStore(this.store, form.value.name, this.index);
        this.editMode = false;
    }

    onDelete() {
        this.storeService.deleteStore(this.store.id, this.index);
    }
}
