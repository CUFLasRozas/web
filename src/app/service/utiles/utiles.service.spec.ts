import { TestBed } from '@angular/core/testing';

import { UtilesService } from './utiles.service';

describe('GeneralService', () => {
  let service: UtilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
