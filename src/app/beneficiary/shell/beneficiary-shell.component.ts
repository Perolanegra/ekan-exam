import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BeneficiaryListComponent } from '../list/benficiary-list.component';
import { BeneficiaryDetailComponent } from '../detail/beneficiary-detail.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'beneficiary-shell',
  standalone: true,
  template: `
    <div class="row">
      <div class="col-md-4">
        <beneficiary-list></beneficiary-list>
      </div>
      <div class="col-md-8">
        <beneficiary-detail></beneficiary-detail>
      </div>
    </div>
  `,
  imports: [BeneficiaryListComponent, BeneficiaryDetailComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeneficiaryShellComponent {}
