import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Renderer2, Input, WritableSignal, HostListener } from '@angular/core';
import { Document } from '../../beneficiary/model/beneficiary';
import { InputControlDocuments } from '../dialog/model/controls';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormsModule],
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent {
  private renderer = inject(Renderer2);

  @Input()
  hideAccordion!: WritableSignal<boolean>;

  @Input()
  controlsDoc!: WritableSignal<InputControlDocuments[]>;

  @Input()
  documents!: Document[];

  toggleAccordion(doc: Document, isClosing?: boolean) {
    doc.showAccordeon = doc.showAccordeon ?? false;
    doc.showAccordeon = !doc.showAccordeon;

    const modalBody = document.querySelector('.modal-body');
    this.renderer.setStyle(modalBody, 'pointer-events', 'none');
    this.renderer.setStyle(modalBody, 'cursor', 'not-allowed');

    const elementRef = document.querySelector(`#${doc.id}`);
    // since im not in directive, i had to get by document.querysSelector, which its not the best approach.
    if (doc.showAccordeon) {
      // so it goes like this, for now, but in a real app this styles manipulations should go in a directive with elementRefInstance.
      (document.querySelector(`.accordion-button.${doc.id}`) as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-360deg)');
      this.renderer.removeClass(elementRef, 'hideEase');
      this.renderer.addClass(elementRef, 'showEase');
      this.renderer.removeClass(elementRef, 'hideAccordion');
    } else {
      (document.querySelector(`.accordion-button.${doc.id}`) as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-180deg)');
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

  @HostListener("window:resetAccordeonState")
  resetAccordeonState = () => {
    this.documents?.map(doc => doc.showAccordeon ? this.toggleAccordion(doc, true) : '');
  };

  @HostListener("window:deleteAccordeonProp")
  deleteAccordeonProp = () => {
    this.documents?.map(doc => delete doc.showAccordeon);
  };

  updateFormValue(value: string, id: string, accordeonIndex: number): void {
    (this.documents[accordeonIndex] as any)[id] = value;
  }

}
