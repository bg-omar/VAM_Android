import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConstantsListComponent} from "./constants-list/constants-list.component";
import {CalculatorComponent} from "./calculator/calculator.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConstantsListComponent, CalculatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'constants-calculator';
}
