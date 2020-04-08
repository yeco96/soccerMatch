import { TestBed } from '@angular/core/testing';

import { TranslateServiceService } from './translate-service.service';

describe('TranslateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslateServiceService = TestBed.get(TranslateServiceService);
    expect(service).toBeTruthy();
  });
});
