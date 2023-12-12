import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryListComponent {
  pageTitle = 'Beneficiários';
  errorMessage = '';
  controlsToRemove = ['addedDate', 'updatedDate', 'id'];
  bService = inject(BeneficiaryService);
  showModalAdd = signal(false);
  docsToCreate = signal<Partial<Document>[]>([]);
  showAccordeon = false;

  controlsDoc = this.bService.inputControlsDocs;
  selectedBeneficiary = this.bService.selectedbeneficiary;
  inputControls = this.bService.inputControlsBeneficiary;
  disableAccBtn: boolean = false;


  // When a beneficiary is selected, emit the selected beneficiary name if it goes to detail
  onSelected(bID: string): void {
    this.bService.beneficiarySelected(bID as string);
    this.disableAccBtn = false;
    this.availableNumbers = Array.from({ length: 30 }, (_, index) => index + 1);
  }

  availableNumbers!: number[];

  addDocuments(formInstance: FormGroup): void {
    if (!this.showAccordeon && !formInstance.controls['documents']) {
      formInstance?.addControl(
        'documents',
        new FormArray([], Validators.required)
      );
      this.showAccordeon = true;
    }

    // It was set on frontend the amount of documents a beneficiary can have
    if (this.availableNumbers.length === 0) {
      this.disableAccBtn = true;
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * this.availableNumbers.length
    );
    const randomUniqueNumber = this.availableNumbers.splice(randomIndex, 1)[0];

    const docRef: Partial<Document> = Object.create({} as Document);
    ['id', 'documentType', 'desc'].map(
      (key) =>
        ((docRef as any)[key] =
          key === 'id' ? `doc-ref${randomUniqueNumber}` : '')
    );

    this.docsToCreate.update(docs => [ ...docs, ...[docRef] ]);

    (formInstance?.controls['documents'] as FormArray)?.push(
      new FormControl(docRef, Validators.required)
    );
  }

  onSubmit(formInstance: FormGroup): void {
    if (formInstance.valid) {
      formInstance.value.documents?.map((doc: Partial<Document>) => delete doc.showAccordeon);
      this.bService.createBeneficiary(formInstance.value);
      this.resetComponentState([], true, false);
      formInstance.reset();
    }
  }

  resetComponentState(
    docsToCreate: any[],
    showAccordeon: boolean,
    showModalAdd: boolean
  ) {
    this.docsToCreate.set(docsToCreate);
    this.showAccordeon = showAccordeon;
    this.showModalAdd.set(showModalAdd);
  }
}
