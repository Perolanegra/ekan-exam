import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { Beneficiary } from '../model/beneficiary';

@Component({
  selector: 'beneficiary-list',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, DialogComponent, AccordionComponent],
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

      .pseudo-clicker {
        position: absolute;
        right: 3.5%;
        flex-direction: column;
        align-items: end;
        padding: 20px;
        cursor: pointer;
        opacity: 0;
      }

    `
  ]
})
export class BeneficiaryListComponent {
  pageTitle = 'Beneficiários';
  errorMessage = '';
  bService = inject(BeneficiaryService);
  showModalAdd = signal(false);
  hideAccordion = signal(true);

  controlsDoc = this.bService.inputControlsDocs;
  selectedBeneficiary = this.bService.selectedbeneficiary;
  inputControls = this.bService.inputControlsBeneficiary;

  // Component signals
  beneficiaries = computed(() => {
    try {
      return this.bService.beneficiarys()
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  // When a beneficiary is selected, emit the selected beneficiary name
  onSelected(bID: string | undefined): void {
    this.bService.beneficiarySelected(bID as string);
  }

  hideAccordeonOnCancel(): void {
    const customEvent = new CustomEvent('resetAccordeonState');
    window.dispatchEvent(customEvent);
  }

  submitRegister(payload: Partial<Beneficiary>): void {
    console.log('submit Register on List component works with payload: ', payload);
  }

}
