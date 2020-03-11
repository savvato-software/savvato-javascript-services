import { TestBed } from '@angular/core/testing';

import { CareerGoalService } from './career-goal.service';

describe('CareerGoalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CareerGoalService = TestBed.get(CareerGoalService);
    expect(service).toBeTruthy();
  });
});
