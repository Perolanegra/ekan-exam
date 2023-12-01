import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { InputControls } from './model/controls';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

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

  @Output()
  canceled: EventEmitter<any> = new EventEmitter();

  @Output()
  submitted: EventEmitter<any> = new EventEmitter();

  @Output()
  addAccordeon: EventEmitter<any> = new EventEmitter();

  addAccordeonElement = (): void => this.addAccordeon.emit();
  cancelWasTriggered = () => this.canceled.emit();

  submit = (form: any) => {
    if (form.valid) {
      this.submitted.emit(this.addMode ? form.value : '');
      this.isActive.set(false);
    }
  }

}
