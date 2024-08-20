import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConstantsListComponent} from "./constants-list/constants-list.component";
import {CalculatorComponent} from "./calculator/calculator.component";
import {LatexParagraphComponent} from "./latex-paragraph/latex-paragraph.component";
import {GenerateEquationComponent} from "./generate-equation/generate-equation.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ConstantsListComponent,
    CalculatorComponent,
    LatexParagraphComponent,
    GenerateEquationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'constants-calculator';
  selectedConstants: any = {};

  onConstantSelected(event: any, field: string) {
    this.selectedConstants[field] = event;
  }

}
