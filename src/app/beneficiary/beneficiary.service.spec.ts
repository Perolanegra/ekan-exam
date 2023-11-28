/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BeneficiaryService } from './beneficiary.service';

describe('Service: Beneficiary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeneficiaryService]
    });
  });

  it('should ...', inject([BeneficiaryService], (service: BeneficiaryService) => {
    expect(service).toBeTruthy();
  }));
});
