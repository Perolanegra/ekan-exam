import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { InputControls } from './model/controls';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  // encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor() { }

  @Input()
  isActive = signal(false);

  @Input()
  controls = signal<InputControls[]>([]);

  @Input()
  beneficiary: string | undefined;

  ngOnInit() {
  }

  submit() {

  }

}
