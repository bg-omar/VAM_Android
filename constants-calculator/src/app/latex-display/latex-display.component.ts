import {Component, ElementRef, Input, OnInit} from '@angular/core';
import katex, {KatexOptions} from 'katex';
import KatexModule, {KatexHtmlComponent} from 'ng-katex';

@Component({
  selector: 'app-latex-display',
  standalone: true,
  templateUrl: './latex-display.component.html',
  styleUrls: ['./latex-display.component.scss']
})
export class LatexDisplayComponent implements OnInit {
  @Input() latex: string = '\\oint_C \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}} + \\mu_0 \\epsilon_0 \\frac{d \\Phi_E}{dt}';
  equation: string = '\\sum_{i=1}^nx_i';

  equation1: string = '\\sum_{i=1}^nx_i';
  equation2: string = 'x=\frac{-b\pm\\sqrt{b^2-4ac}}{2a}';
  equation3: string = '\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.';


  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.renderMath();
  }

  renderMath() {
    const element = this.el.nativeElement.querySelector('#katex-container');
    if (element) {
      katex.render(this.latex, element, {
        throwOnError: false
      });
    }
  }
}
