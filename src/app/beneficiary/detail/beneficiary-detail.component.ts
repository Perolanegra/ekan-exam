import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';

@Component({
  selector: 'beneficiary-detail',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, DialogComponent, AccordionComponent],
  templateUrl: './beneficiary-detail.component.html',
  styles: [
    `.box-docs {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      height: 400px;
    }

    li span {
      text-decoration: underline;
    }
    `
  ]
})
export class BeneficiaryDetailComponent {
  errorMessage = '';
  beneficiaryService = inject(BeneficiaryService);
  showModal = signal(false);

  // Signals used in the template
  selectedBeneficiary = this.beneficiaryService.selectedbeneficiary;
  beneficiaryDocuments = this.beneficiaryService.beneficiaryDocuments;
  inputControls = this.beneficiaryService.inputControlsBeneficiary;
  pageTitle = computed(() => this.selectedBeneficiary() ? `Detalhes do Beneficiário: ${this.selectedBeneficiary()?.name}` : '');

}
