import { NgClass } from '@angular/common';
import { Component, OnInit, signal, inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [NgClass],
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements OnInit {

  constructor() { }

  private renderer = inject(Renderer2);

  hideAccordion = signal(true);

  ngOnInit() {
  }

  toggleAccordion(elementIdRef: string) {
    const elementRef = document.querySelector(elementIdRef);
    // since im not in directive, this wont work.

    // let elementBtn = document.querySelector('.accordion-button');
    // this.renderer.setProperty(elementBtn, '--bs-accordion-btn-icon-transform', 'rotate(-360deg)')
    if (!this.hideAccordion()) {
      // so it goes like this, for now, but in a real app this styles manipulations should go in a directive.
      (document.querySelector('.accordion-button') as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-360deg)');
      this.renderer.removeClass(elementRef, 'hideEase');
      this.renderer.addClass(elementRef, 'showEase');
      this.renderer.removeClass(elementRef, 'hideAccordion');
    } else {
      (document.querySelector('.accordion-button') as any)?.style.setProperty('--bs-accordion-btn-icon-transform', 'rotate(-180deg)');
      this.renderer.removeClass(elementRef, 'showEase');
      this.renderer.addClass(elementRef, 'hideEase');
      setTimeout(() => {
        this.renderer.addClass(elementRef, 'hideAccordion');
      }, 600);
    }
  }

}
