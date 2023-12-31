import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  inject,
  Renderer2,
  Input,
  WritableSignal,
  AfterContentInit,
  ChangeDetectionStrategy,
  Signal,
  OnDestroy,
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
  imports: [NgClass, NgFor, NgIf, FormsModule, AsyncPipe],
  styleUrls: ['./accordion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent implements AfterContentInit, OnDestroy {
  private renderer = inject(Renderer2);

  @Input()
  controlsDoc!: WritableSignal<InputControlDocuments[]>;

  @Input()
  addMode: boolean = false;

  @Input()
  accordeonForm!: FormGroup;

  @Input()
  selectedData!: Signal<any[]>;

  @Input()
  accordeonControlName!: string;

  ngAfterContentInit(): void {
    if (!this.addMode) this.addControls(this.accordeonForm);
  }

  ngOnDestroy(): void {
    this.selectedData().map((item) => delete item.showAccordeon);
  }

  addControls(formInstance: FormGroup): void {
    formInstance?.addControl(
      this.accordeonControlName,
      new FormArray([], Validators.required)
    );

    let newDoc: any = {};

    this.selectedData().map((doc: any) => {
      Object.keys(doc).forEach((key: any) => {
        newDoc = { ...newDoc, [key]: doc[key] };
      });

      this.items?.push(new FormControl(newDoc, Validators.required));
    });

    this.items?.setErrors({ incorrect: true });
  }

  get items() {
    return this.accordeonForm?.get(this.accordeonControlName) as FormArray;
  }

  setErrorState(index: number): void {
    ((this.items as FormArray)?.value as [])?.map((inputControls) => {
      Object?.keys(inputControls).forEach((inputKey) => {
        if (!this.items.value[index][inputKey]) {
          // engloba valores falsos e a a ausencia da prop em um novo indice
          this.items?.setErrors({ incorrect: true });
        }
      });
    });
  }

  updateFormValue = (keyControl: string, value: any, index: string) => {
    const valueToSpread = { [keyControl]: value };

    this.items
      ?.get(index)
      ?.setValue({ ...this.items.value[index], ...valueToSpread });

    this.setErrorState(+index);
  };

  toggleAccordion(doc: Document): void {
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
    }, 800);
  }
}
