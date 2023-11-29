import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, WritableSignal, signal } from '@angular/core';
import { InputControls } from './model/controls';
import { Beneficiary } from '../../beneficiary/model/beneficiary';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor() { }

  @Input()
  isActive = signal(false);

  @Input()
  controls!: WritableSignal<InputControls[]>

  @Input()
  beneficiary!: WritableSignal<Beneficiary>;

  @Input()
  addBeneficiaryMode: boolean = false;

  addDoc(): void {
    console.log('add doc method works!');
  }

  hideAccordion() {
    
  }

  submit() {

  }

}
