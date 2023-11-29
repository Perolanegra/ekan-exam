import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, signal, inject, Renderer2, Input, WritableSignal } from '@angular/core';
import { Document } from '../../beneficiary/model/beneficiary';
import { InputControlDocuments } from '../dialog/model/controls';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent {

  constructor() { }

  private renderer = inject(Renderer2);

  hideAccordion = signal(true);

  @Input()
  controlsDoc!: WritableSignal<InputControlDocuments[]>;

  @Input()
  documents!: Document[];

  toggleAccordion(elementIdRef: string) {
    const modalBody = document.querySelector('.modal-body');
    this.renderer.setStyle(modalBody, 'pointer-events', 'none');
    this.renderer.setStyle(modalBody, 'cursor', 'not-allowed');

    const elementRef = document.querySelector(`#${elementIdRef}`);
    // since im not in directive, then this below wont work.
    // let elementBtn = document.querySelector('.accordion-button');
    // this.renderer.setProperty(elementBtn, '--bs-accordion-btn-icon-transform', 'rotate(-360deg)')
    if (!this.hideAccordion()) {
      // so it goes like this, for now, but in a real app this styles manipulations should go in a directive.
      (document.querySelector(`.accordion-button.${elementIdRef}`) as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-360deg)');
      this.renderer.removeClass(elementRef, 'hideEase');
      this.renderer.addClass(elementRef, 'showEase');
      this.renderer.removeClass(elementRef, 'hideAccordion');
    } else {
      (document.querySelector(`.accordion-button.${elementIdRef}`) as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-180deg)');
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
