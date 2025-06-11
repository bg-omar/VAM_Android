import { Component, input } from '@angular/core';

@Component({
  selector: 'app-differentiator',
  templateUrl: './differentiator.component.html',
  standalone: true,
  styleUrl: './differentiator.component.css'
})
export class DifferentiatorComponent {

  protected readonly input = input;
}
