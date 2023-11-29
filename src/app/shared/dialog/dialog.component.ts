import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, WritableSignal, signal } from '@angular/core';
import { InputControls } from './model/controls';
import { Beneficiary } from '../../beneficiary/model/beneficiary';

// type OnlyKeys = keyof typeof DialogComponent;

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor() { }



  @Input()
  isActive = signal(false);

  @Input()
  controls!: WritableSignal<InputControls[]>

  @Input()
  beneficiary!: WritableSignal<Beneficiary>;

  ngOnInit() {
  }


  submit() {

  }

}
