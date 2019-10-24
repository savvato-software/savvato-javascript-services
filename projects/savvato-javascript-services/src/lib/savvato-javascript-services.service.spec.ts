import { TestBed } from '@angular/core/testing';

import { SavvatoJavascriptServicesService } from './savvato-javascript-services.service';

describe('SavvatoJavascriptServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavvatoJavascriptServicesService = TestBed.get(SavvatoJavascriptServicesService);
    expect(service).toBeTruthy();
  });
});
