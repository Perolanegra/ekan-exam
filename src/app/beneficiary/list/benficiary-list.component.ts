import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { Document } from '../model/beneficiary';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'beneficiary-list',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    DialogComponent,
    AccordionComponent,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  templateUrl: './beneficiary-list.component.html',
  styles: [
    `
      .own-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .card-header::after {
        content: url('../svg/add-beneficiary.svg');
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BeneficiaryListComponent {
  pageTitle = 'Beneficiários';
  errorMessage = '';
  controlsToRemove = ['addedDate', 'updatedDate', 'id'];
  bService = inject(BeneficiaryService);
  showModalAdd = signal(false);
  showAccordeon = false;

  controlsDoc = this.bService.inputControlsDocs;
  selectedBeneficiary = this.bService.selectedbeneficiary;
  inputControls = this.bService.inputControlsBeneficiary;
  disableAccBtn: boolean = false;

  // Component signals
  beneficiaries = computed(() => {
    try {
      return this.bService.beneficiarys();
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
        this.selectedBeneficiary().documents = [];
        this.availableNumbers = Array.from(
          { length: 30 },
          (_, index) => index + 1
        );
      }
      this.bService.beneficiarySelected(bID as string);
    }
  }

  availableNumbers!: number[];

  addDocuments(formInstance: FormGroup): void {
    this.showAccordeon = true;
    // It was set on frontend the amount of documents a beneficiary can have
    if (this.availableNumbers.length === 0) {
      this.disableAccBtn = true;
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * this.availableNumbers.length
    );
    const randomUniqueNumber = this.availableNumbers.splice(randomIndex, 1)[0];

    let docRef = Object.create({} as Document);
    const documentKeys = [
      'id',
      'documentType',
      'desc',
      'addedDate',
      'updatedDate',
    ];

    documentKeys.map((key) => {
      docRef[key] = key === 'id' ? `doc-ref${randomUniqueNumber}` : '';
      ('');
      if (key.includes('Date')) delete docRef[key];
    });

    const ref = this.selectedBeneficiary().documents;
    this.selectedBeneficiary().documents = ref ? [...ref, docRef] : [docRef];

    (formInstance?.controls['documents'] as FormArray)?.push(
      new FormControl(null, Validators.required)
    );
  }

  onSubmit(formInstance: FormGroup): void {
    if (formInstance.valid) {
      this.showModalAdd.set(false);
      this.showAccordeon = true;
      this.bService.createBeneficiary(formInstance.value);
    }
  }
}
