import { TestBed } from '@angular/core/testing';

import { JWTApiService } from './api.service';

describe('ApiService', () => {
  let service: JWTApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWTApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
