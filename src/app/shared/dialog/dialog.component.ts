import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { InputControls } from './model/controls';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Document } from '../../beneficiary/model/beneficiary';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [
    provideNgxMask()
  ],
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor() { }

  removeAccentuationReg = /[\u0300-\u036f]/g;

  @Input()
  isActive = signal(false);

  @Input()
  controls!: WritableSignal<InputControls[]>

  @Input()
  selectedData!: WritableSignal<any>;

  @Input()
  addMode: boolean = false;

  @Input()
  addAccordeonBtnText!: string;

  @Input()
  headerText!: string;

  @Input()
  disableAccBtn!: boolean;

  @Input()
  documents!: Document[];

  @Output()
  canceled: EventEmitter<any> = new EventEmitter();

  @Output()
  submitted: EventEmitter<any> = new EventEmitter();

  @Output()
  addAccordeon: EventEmitter<any> = new EventEmitter();

  addAccordeonElement = (formInstance: FormGroup): void => {
    formInstance.controls['documents'] ? '' :
      formInstance.addControl('documents', new FormControl(this.documents, Validators.required));
    this.removeDateControls(formInstance);
    this.addAccordeon.emit(true);
  }

  removeDateControls(formInstance: FormGroup) {
    formInstance.removeControl('addedDate');
    formInstance.removeControl('updateDate');
  }

  cancelWasTriggered = () => this.canceled.emit();

  submit(formInstance: FormGroup) {
    const documentsArray = formInstance.get('documents') as FormControl;
    const fullfiled = documentsArray?.value.every((documentObj: any) =>
      Object.values(documentObj).every((valor) => valor !== '')
    );

    if (this.addMode && fullfiled) {
      this.closeaAndEmit(formInstance.value);
    } else {
      this.removeDateControls(formInstance);
      if (formInstance.valid) {
        this.closeaAndEmit(formInstance.value);
      }
    }

  }

  private closeaAndEmit(formValue: any) {
    this.submitted.emit(formValue);
    this.isActive.set(false);
  }

}
