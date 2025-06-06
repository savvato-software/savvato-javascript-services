import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { JWTApiService } from './api.service';
import { AuthService } from '../auth/auth.service';

describe('ApiService', () => {
  let service: JWTApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JWTApiService,
        { provide: AuthService, useValue: { getToken: () => 'test-token' } }
      ]
    });
    service = TestBed.inject(JWTApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include Authorization header when auth flag is true', () => {
    const headers = service.getHeaders();
    expect(headers.get('Authorization')).toBe('Bearer test-token');
  });
});
