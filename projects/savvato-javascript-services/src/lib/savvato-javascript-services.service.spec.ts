import { TestBed } from '@angular/core/testing';

import { SavvatoJavascriptServicesService } from './savvato-javascript-services.service';

describe('SavvatoJavascriptServicesService', () => {
  let service: SavvatoJavascriptServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavvatoJavascriptServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
