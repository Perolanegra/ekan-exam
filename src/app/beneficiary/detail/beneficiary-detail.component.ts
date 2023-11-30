import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'beneficiary-detail',
  standalone: true,
  imports: [NgFor, NgIf, DialogComponent, AccordionComponent, DatePipe, NgClass, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './beneficiary-detail.component.html',
  providers: [
    provideNgxMask()
  ],
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

    .remove-icon {
      background-image: url('../svg/remove-icon.svg');
      background-size: cover;
      width: 4.5%;
      cursor: pointer;
      margin-right: 1%;
    }

    .card-header:first-child {
      display: flex;
      justify-content: space-between;
    }

    `
  ]
})
export class BeneficiaryDetailComponent {
  errorMessage = '';
  beneficiaryService = inject(BeneficiaryService);
  showModal = signal(false);
  hideAccordion = signal(true);

  // Signals used in the template
  selectedBeneficiary = this.beneficiaryService.selectedbeneficiary;
  beneficiaryDocuments = this.beneficiaryService.beneficiaryDocuments;
  inputControls = this.beneficiaryService.inputControlsBeneficiary;
  controlsDoc = this.beneficiaryService.inputControlsDocs;

  pageTitle = computed(() => this.selectedBeneficiary() ? `Detalhes do Beneficiário: ${this.selectedBeneficiary()?.name}` : '');

  hideAccordeonOnClosed(): void {
    const customEvent = new CustomEvent('resetAccordeonState');
    window.dispatchEvent(customEvent);
  }

  updateBeneficiary(): void {
    this.beneficiaryService.updateBeneficiary(this.selectedBeneficiary());
    this.hideAccordeonOnClosed();
  }

  removeBeneficiary(idBeneficiary: string | undefined): void {
    idBeneficiary ? this.beneficiaryService.removeBeneficiaryById(idBeneficiary) : '';
  }

}
