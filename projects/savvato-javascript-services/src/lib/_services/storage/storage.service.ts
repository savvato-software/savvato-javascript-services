import { Injectable } from '@angular/core';
import { StorageKey } from './storage.model';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private storage: Storage;

    constructor() {
        this.storage = localStorage;
    }

    public save(key: StorageKey, value: any) {
        value = JSON.stringify(value);
        this.storage.setItem(key, value);
    }

    public read(key: StorageKey): any {
        const item = this.storage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    public remove(key: StorageKey) {
        return this.storage.removeItem(key);
    }

    public clear() {
        this.storage.clear();
    }
}
