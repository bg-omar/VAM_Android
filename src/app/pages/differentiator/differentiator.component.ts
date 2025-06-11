import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Node based library copied under src/lib
const differentiator = require('@lib/node-differentiator');

@Component({
  selector: 'app-differentiator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './differentiator.component.html',
  styleUrl: './differentiator.component.css'
})
export class DifferentiatorComponent implements OnInit {
  inputFunction = '';
  result: string | null = null;
  story: string[] = [];

  private examples = [
    '(1 + sin(x)) ^ 3',
    'ln(sqrt(x) + 1)',
    '10 * (x + tan(x))',
    'sqrt(32)*x^sqrt(2)',
    '-8/(x)^2',
    '5*x^-1.5'
  ];

  ngOnInit() {
    this.inputFunction = this.examples[Math.floor(Math.random() * this.examples.length)];
    this.calculate();
  }

  calculate() {
    const response = differentiator.getDerivative(this.inputFunction);
    if (response.status === 'success') {
      this.result = response.result;
      this.story = response.story;
    } else {
      this.result = 'Can\'t understand, sorry :('; // mimic original
      this.story = [];
    }
  }
}
