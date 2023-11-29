import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';

@Component({
  selector: 'beneficiary-list',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './beneficiary-list.component.html',
  styles: [
    `
      .own-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .card-header::after {
        content: url("../svg/add-beneficiary.svg");
        cursor: pointer;
        padding: 4px 8px;
        background: #0d6efd;
        border-radius: 4px;
      }

      .own-header::after:hover {
        background: blue;
      }

    `
  ]
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
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  selectedBeneficiary = this.bService.selectedbeneficiary;
  // When a beneficiary is selected, emit the selected beneficiary name
  onSelected(bID: string | undefined): void {
    this.bService.beneficiarySelected(bID as string);
  }

}
