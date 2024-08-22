import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ConstantsListComponent} from "./constants-list/constants-list.component";
import {CalculatorComponent} from "./calculator/calculator.component";
import {ChatComponent} from "./iframe/chat.component";
import {LatexDisplayComponent} from "./latex-display/latex-display.component";
import {LatexParagraphComponent} from "./latex-paragraph/latex-paragraph.component";
import { HomePage } from './app/home/home.page';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ConstantsListComponent,
    CalculatorComponent,
    ChatComponent,
    LatexDisplayComponent,
    LatexParagraphComponent,
    HomePage,
    IonApp,
    IonRouterOutlet,
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
