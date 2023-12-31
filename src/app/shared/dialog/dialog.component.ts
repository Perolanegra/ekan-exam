import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';
import { InputControls } from './model/controls';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements AfterContentInit {
  constructor() {}

  removeAccentuationReg = /[\u0300-\u036f]/g;

  @Input()
  isActive = signal(false);

  @Input()
  controls!: WritableSignal<InputControls[]>;

  @Input()
  selectedData!: Signal<any>;

  @Input()
  addMode: boolean = false;

  @Input()
  addAccordeonBtnText!: string;

  @Input()
  headerText!: string;

  @Input()
  disableAccBtn!: boolean;

  @Input()
  dialogForm!: FormGroup;

  @Input()
  readOnlyControls!: string[];

  @Output()
  canceled: EventEmitter<any> = new EventEmitter();

  @Output()
  addAccordeon: EventEmitter<any> = new EventEmitter();

  ngAfterContentInit(): void {
    this.addControls(this.dialogForm);
  }

  addAccordeonElement = (): void => this.addAccordeon.emit();

  updateDialogFormValue = (keyControl: string, value: any) =>
    this.dialogForm.get(keyControl)?.setValue(value);

  addControls(formInstance: FormGroup): void {
    this.controls().map((inputControl) => {
      if (!this.readOnlyControls.includes(inputControl.id)) {
        formInstance?.addControl(
          inputControl.id,
          new FormControl(
            this.selectedData()[inputControl.id],
            Validators.required
          )
        );
      }
    });
  }

  cancelWasTriggered = () => this.canceled.emit();
}
