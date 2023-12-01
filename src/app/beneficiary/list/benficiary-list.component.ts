import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { Beneficiary } from '../model/beneficiary';
import { Document } from '../model/beneficiary';

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

  registerDocs: Document[] = [];
  disableAccBtn: boolean = false;

  // Component signals
  beneficiaries = computed(() => {
    try {
      return this.bService.beneficiarys()
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  // When a beneficiary is selected, emit the selected beneficiary name if it goes to detail
  onSelected(bID: string): void {
    if (bID) {
      if (bID === 'none') {
        this.disableAccBtn = false;
        this.registerDocs = [];
        this.availableNumbers = Array.from({ length: 30 }, (_, index) => index + 1);
      }
      this.bService.beneficiarySelected(bID as string);
    }
  }

  availableNumbers!: number[];

  addDocuments(): void {
    // It was set on frontend the amount of documents a beneficiary can have
    if (this.availableNumbers.length === 0) {
      this.disableAccBtn = true;
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableNumbers.length);
    const randomUniqueNumber = this.availableNumbers.splice(randomIndex, 1)[0];

    let objDoc = Object.create({} as Document);
    this.bService.documentKeys().map((key, i) => {
      objDoc[key] = key === 'id' ? `doc-ref${randomUniqueNumber}` : '';
      if (key.includes('Date')) delete objDoc[key];
    });
    this.registerDocs.push(objDoc);
  }

  triggerCustomEvent(eventName: string): void {
    const customEvent = new CustomEvent(eventName);
    window.dispatchEvent(customEvent);
  }

  submitRegister(payload: Partial<Beneficiary>): void {
    this.triggerCustomEvent('deleteAccordeonProp');
    this.bService.createBeneficiary(payload);
    this.selectedBeneficiary().name = '';
  }

}
