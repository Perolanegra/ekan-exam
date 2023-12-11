import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { AccordionComponent } from '../../shared/accordion/accordion.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormGroup, FormsModule } from '@angular/forms';
import { Beneficiary } from '../model/beneficiary';

@Component({
  selector: 'beneficiary-detail',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    DialogComponent,
    AccordionComponent,
    DatePipe,
    NgClass,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
  ],
  templateUrl: './beneficiary-detail.component.html',
  providers: [provideNgxMask()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .box-docs {
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
    `,
  ],
})
export class BeneficiaryDetailComponent {
  errorMessage = '';
  beneficiaryService = inject(BeneficiaryService);
  showModal = signal(false);

  // Signals used in the template
  selectedBeneficiary = this.beneficiaryService.selectedbeneficiary;
  beneficiaryDocuments = this.beneficiaryService.beneficiaryDocuments;
  inputControls = this.beneficiaryService.inputControlsBeneficiary;
  controlsDoc = this.beneficiaryService.inputControlsDocs;
  controlsToRemove = ['addedDate', 'updatedDate'];

  pageTitle = computed(() =>
    this.selectedBeneficiary()
      ? `Detalhes do Beneficiário: ${this.selectedBeneficiary()?.name}`
      : ''
  );

  onSubmit(formInstance: FormGroup): void {
    if (formInstance.valid) {
      this.showModal.set(false);
      this.selectedBeneficiary.set(formInstance.value);
      this.beneficiaryService.updateBeneficiary(formInstance.value);
    }
  }

  removeBeneficiary(idBeneficiary: string | undefined): void {
    if (idBeneficiary) {
      this.beneficiaryService.removeBeneficiaryById(idBeneficiary);
      this.selectedBeneficiary.set({} as Beneficiary);
    }
  }
}
