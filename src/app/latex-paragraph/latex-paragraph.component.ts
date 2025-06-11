import {Component, Input, OnInit} from '@angular/core';
import {MathJaxService} from "../math-jax.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import { extractMath } from 'extract-math'

@Component({
  selector: 'app-latex-paragraph',
  standalone: true,
  imports: [],
  templateUrl: './latex-paragraph.component.html',
  styleUrls: ['./latex-paragraph.component.scss']
})
export class LatexParagraphComponent implements OnInit{
  @Input({ required: true }) inputString!: string;

  _html: any = [];
  _safeHtml: SafeHtml | undefined;

  constructor(private domSanitizer: DomSanitizer, private latexService: MathJaxService) {}

  ngOnInit() {
    // Break the string into segments ('text', 'inline', and 'display')
    const segments = extractMath(this.inputString, {
      delimiters: {
        inline: ['$', '$'],
        display: ['$$', '$$']
      }
    })

    // Parse the LaTeX equation to HTML
    for (let i = 0; i < segments.length; i++) {
      if (segments[i]['type'] == 'text') {
        this._html.push(segments[i]['value'])
      }
      else if (segments[i]['type'] == 'inline') {
        this._html.push(this.latexService.renderToString(segments[i]['value'], { output: "mathml", throwOnError: false, displayMode: false }))
      }
      else if (segments[i]['type'] == 'display') {
        this._html.push(this.latexService.renderToString(segments[i]['value'], { output: "mathml", throwOnError: false, displayMode: true }))
      }
      else {
        console.warn("An error occurred when parsing the LaTex input. The type of the segment is not recognized.");
      }
    }

    this._safeHtml = this.domSanitizer.bypassSecurityTrustHtml(this._html.join(""));

  }
}
