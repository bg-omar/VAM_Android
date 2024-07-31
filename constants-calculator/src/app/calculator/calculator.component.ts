import { Component } from '@angular/core';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";


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
export class CalculatorComponent {

  droppedItems: any[] = [];
  expression: string = '';
  result: number | string = '';

  drop(event: CdkDragDrop<any[]>): void {
    const item = event.item.data;
    this.droppedItems.push(item);
  }

  calculate(): void {
    try {
      const func = new Function('constants', `return ${this.expression};`);
      const constants = this.droppedItems.reduce((acc, item) => {
        acc[item.constant] = item.value;
        return acc;
      }, {});
      this.result = func(constants);
    } catch (error) {
      this.result = 'Error in formula';
    }
  }
}
