import {Component, OnDestroy, OnInit} from '@angular/core';
import { buttonsRows } from '../../utils/buttons';
import { Button } from '../../utils/Button';
import { ComponentStore } from '@ngrx/component-store';
import { Subscription } from 'rxjs';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule, NgForOf } from '@angular/common';
import {ConstantsListComponent} from "../../constants-list/constants-list.component";
import {IonApp, IonRouterOutlet} from "@ionic/angular/standalone";
import {LatexParagraphComponent} from "../../latex-paragraph/latex-paragraph.component";
import {RouterOutlet} from "@angular/router";
import {CalculatorComponent} from "../../calculator/calculator.component";
import {DialogComDialog} from "../../generate-equation/generate-equation.component";
import {DifferentiatorComponent} from "../differentiator/differentiator.component";
import {ViewNameComponent} from "../view-name/view-name.component";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {EmoticonListComponent} from "../../emoticon-list/emoticon-list.component";
import {LargeLatexTextComponent} from "../../large-latex-text-component/large-latex-text.component";


@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  standalone: true,
  styleUrls: ['home.page.scss'],
  imports: [
    CdkDrag,
    NgForOf, IonicModule, CommonModule, ConstantsListComponent, IonApp, IonRouterOutlet, LatexParagraphComponent, RouterOutlet, CalculatorComponent, DialogComDialog, DifferentiatorComponent, ViewNameComponent, FormsModule, EmoticonListComponent, LargeLatexTextComponent
  ],
})
export class HomePage implements  OnInit {

  title = 'constants-calculator';
  selectedConstants: any = {};

  onConstantSelected(event: any, field: string) {
    this.selectedConstants[field] = event;
  }
  functionInput: string;
  result: any;

  constructor(private derivativeService: ApiService) {}

  onSubmit() {
    this.derivativeService.calculateDerivative(this.functionInput).subscribe(
      res => this.result = res,
      err => console.error(err)
    );
  }

  ngOnInit() {
    console.log("%c 1 --> Line: 53||home.page.ts\n ngOnInit: ","color:#f0f;");

  }

}
