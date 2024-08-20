import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {ConstantsService} from "../constants.service";
import {Constant} from "../constants.type"


@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CdkDropList,
    FormsModule,
    NgForOf
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit, OnChanges {
  @Input() selectedConstants: any = {};

  droppedItems: any[] = [];
  expression: string = '';
  result: number | string = '';
  constants: any[] = [];


  ngOnChanges(): void {
    this.calculate();
  }

  constructor(private constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.constants = this.constantsService.getConstants();
  }

  selectConstant(event: any, field: string): void {
    const selectedConstant = this.constants.find(c => c.constant === event.target.value);
    if (selectedConstant) {
      this.selectedConstants[field] = selectedConstant.value;
    }
  }


  drop(event: CdkDragDrop<any[]>): void {
    const item = event.item.data;
    this.droppedItems.push(item);
  }

  calculate(): void {
    try {
      const { mass, speedOfLight } = this.selectedConstants;
      if (mass && speedOfLight) {
        this.result = mass * Math.pow(speedOfLight, 2);
      } else {
        this.result = 'Please select all constants';
      }
    } catch (error) {
      this.result = 'Error in formula';
    }
  }
}
