import {Component, OnInit} from '@angular/core';
import {LatexParagraphComponent} from "../latex-paragraph/latex-paragraph.component";
import {NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import { HttpClient } from '@angular/common/http';

const chatfile: string = 'assets/texts/texty.txt' ;
@Component({
  selector: 'app-large-latex-text-component',
  standalone: true,
  templateUrl: './large-latex-text.component.html',
  imports: [
    LatexParagraphComponent,
    NgSwitch,
    NgForOf,
    NgSwitchCase
  ],
  styleUrl: './large-latex-text.component.scss'
})

export class LargeLatexTextComponent implements OnInit {

  largeText: string = '';  // Initially empty
  parsedSections: { type: 'block' | 'inline'; content: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTextFile();
  }

  loadTextFile(): void {
    this.http.get(chatfile, { responseType: 'text' })
      .subscribe(
        (data: string) => {
          this.largeText = data;  // Store the content of the .txt file
          this.parsedSections = this.parseLatex(this.largeText);  // Process the file content
          console.log("%c 1 --> Line: 36||large-latex-text.component.ts\n this.parsedSections: ","color:#f0f;", this.parsedSections);
        },
        (error) => {
          console.error('Could not load the text file', error);
        }
      );
  }

  parseLatex(input: string): { type: 'block' | 'inline'; content: string }[] {
    const sections: { type: 'block' | 'inline'; content: string }[] = [];

    // First, split the text into parts based on block LaTeX (\[...\])
    const blockRegex = /\\\[([\s\S]*?)\\\]/g;
    let lastIndex = 0;
    let match;

    while ((match = blockRegex.exec(input)) !== null) {
      // Add the text before the block LaTeX (plain text or inline LaTeX)
      if (match.index > lastIndex) {
        const textBefore = input.slice(lastIndex, match.index);
        sections.push(...this.extractInlineAndText(textBefore));
      }

      // Add the block LaTeX (use $$...$$)
      sections.push({
        type: 'block',
        content: `$$${match[1].trim()}$$`
      });

      lastIndex = blockRegex.lastIndex;
    }

    // Handle any remaining text after the last block LaTeX
    if (lastIndex < input.length) {
      const remainingText = input.slice(lastIndex);
      sections.push(...this.extractInlineAndText(remainingText));
    }

    return sections;
  }

  extractInlineAndText(input: string): { type: 'block' | 'inline'; content: string }[] {
    const sections: { type: 'block' | 'inline'; content: string }[] = [];

    // Split the content by double newlines (empty lines)
    const paragraphs = input.split(/\n\s*\n/g);

    paragraphs.forEach(paragraph => {
      // Now within each paragraph, replace the inline LaTeX: \( ... \) => $ ... $
      const inlineContent = this.convertInlineLatex(paragraph.trim());

      // Push the inline LaTeX with text as a single inline section
      if (inlineContent) {
        sections.push({ type: 'inline', content: inlineContent });
      }
    });

    return sections;
  }

  convertInlineLatex(input: string): string {
    // Convert inline LaTeX: \( ... \) => $ ... $
    return input.replace(/\\\((.*?)\\\)/g, '$$$1$');
  }
}
