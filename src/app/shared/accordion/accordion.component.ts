import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  inject,
  Renderer2,
  Input,
  WritableSignal,
  HostListener,
  AfterContentInit,
} from '@angular/core';
import { Document } from '../../beneficiary/model/beneficiary';
import { InputControlDocuments } from '../dialog/model/controls';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule],
  styleUrls: ['./accordion.component.css'],
})
export class AccordionComponent implements AfterContentInit {
  private renderer = inject(Renderer2);

  @Input()
  controlsDoc!: WritableSignal<InputControlDocuments[]>;

  @Input()
  addMode: boolean = false;

  @Input()
  accordeonForm!: FormGroup;

  @Input()
  readOnlyControls!: string[];

  @Input()
  selectedData!: any[];

  @Input()
  accordeonControlName!: string;

  ngAfterContentInit(): void {
    console.log('entrei no acc');
    this.addControls(this.accordeonForm);
  }

  addControls(formInstance: FormGroup): void {
    formInstance?.addControl(
      this.accordeonControlName,
      new FormArray([], Validators.required)
    );

    this.selectedData?.map((doc) => {
      const newDoc: any = {};

      if (!this.addMode) {
        Object.keys(doc)?.forEach((key) => {
          if (!this.readOnlyControls.includes(key)) {
            newDoc[key] = doc[key];
          }
        });
      }

      (formInstance?.controls[this.accordeonControlName] as FormArray)?.push(
        new FormControl(this.addMode ? null : newDoc, Validators.required)
      );
    });
  }

  updateFormValue = (keyControl: string, value: any, index: number) => {
    console.log('keyControl', keyControl);
    console.log('value', value);

    if (this.addMode) {
      // TODO: preciso setar o novo valor.
      // (this.accordeonForm?.controls['documents'] as FormArray).setValue([ { [keyControl]: value } ])
      // (this.accordeonForm?.controls['documents'] as FormArray)[index] = { [keyControl]: value };
    }

    // console.log('ok: ', (this.accordeonForm?.controls['documents'] as FormArray)?.get(keyControl)?.value);

  }

  toggleAccordion(doc: Document, isClosing?: boolean): void {
    doc.showAccordeon = doc.showAccordeon ?? false;
    doc.showAccordeon = !doc.showAccordeon;

    const modalBody = document.querySelector('.modal-body');
    this.renderer.setStyle(modalBody, 'pointer-events', 'none');
    this.renderer.setStyle(modalBody, 'cursor', 'not-allowed');

    const elementRef = document.querySelector(`#acc-body-${doc.id}`);

    if (!elementRef) {
      alert('O servidor não retornou os dados!');
      return;
    }

    // since im not in directive, i had to get by document.querysSelector, which its not the best approach.
    if (doc.showAccordeon) {
      // so it goes like this, for now, but in a real app this styles manipulations should go in a directive with elementRefInstance.
      (document.querySelector(`#acc-btn-${doc.id}`) as any)?.style.setProperty(
        '--bs-accordion-btn-icon-transform',
        'rotate(-360deg)'
      );
      this.renderer.removeClass(elementRef, 'hideEase');
      this.renderer.addClass(elementRef, 'showEase');
      this.renderer.removeClass(elementRef, 'hideAccordion');
    } else {
      (document.querySelector(`#acc-btn-${doc.id}`) as any)?.style.setProperty(
        '--bs-accordion-btn-icon-transform',
        'rotate(-180deg)'
      );
      this.renderer.removeClass(elementRef, 'showEase');
      this.renderer.addClass(elementRef, 'hideEase');
      setTimeout(() => {
        this.renderer.addClass(elementRef, 'hideAccordion');
      }, 600);
    }

    setTimeout(() => {
      this.renderer.setStyle(modalBody, 'pointer-events', 'unset');
      this.renderer.setStyle(modalBody, 'cursor', 'unset');
      if (isClosing) delete doc.showAccordeon;
    }, 800);
  }
}
