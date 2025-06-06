import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { StorageKey } from './storage.model';

describe('StorageService', () => {
    let service: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StorageService);
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return null when key not present', () => {
        expect(service.read(StorageKey.AUTH_TOKEN)).toBeNull();
    });
});
