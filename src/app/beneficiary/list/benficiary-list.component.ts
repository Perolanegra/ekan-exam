import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';

@Component({
  selector: 'beneficiary-list',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './beneficiary-list.component.html'
})
export class BeneficiaryListComponent {
  pageTitle = 'Beneficiários';
  errorMessage = '';
  bService = inject(BeneficiaryService);

  // Component signals
  beneficiaries = computed(() => {
    try {
      return this.bService.beneficiarys()
    } catch (e) {
      this.errorMessage = typeof e === 'string'? e : 'Error';
      return [];
    }
  });

  selectedBeneficiary = this.bService.selectedbeneficiary;
  // When a beneficiary is selected, emit the selected beneficiary name
  onSelected(bID: string | undefined): void {
    this.bService.beneficiarySelected(bID as string);
  }

}
