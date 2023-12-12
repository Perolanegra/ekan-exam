import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BeneficiaryListComponent } from '../list/benficiary-list.component';
import { BeneficiaryDetailComponent } from '../detail/beneficiary-detail.component';
import { NgIf } from '@angular/common';
import { BeneficiaryService } from '../beneficiary.service';

@Component({
  selector: 'beneficiary-shell',
  standalone: true,
  template: `
    <div class="row">
      <div class="col-md-4">
        <beneficiary-list></beneficiary-list>
      </div>
      <div class="col-md-8">
        <ng-container *ngIf="bService.selectedbeneficiary().documents?.length">
          <beneficiary-detail></beneficiary-detail>
        </ng-container>
      </div>
    </div>
  `,
  imports: [BeneficiaryListComponent, BeneficiaryDetailComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryShellComponent {
  bService = inject(BeneficiaryService);
}
