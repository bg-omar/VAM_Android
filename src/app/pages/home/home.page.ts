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
import {ChatArchiveService, ParsedConversation} from "@app/services/chat-archive.service";


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
  /**
   * List of parsed conversations. Each entry contains the conversation title and
   * a hierarchy of message nodes ready for treemap layout.
   */
  conversations: ParsedConversation[] = [];

  /**
   * Index of the currently selected conversation in the `conversations` array.
   */
  selectedIndex: number | null = null;
  constructor(    private chatArchiveService: ChatArchiveService, private derivativeService: ApiService) {}

  onSubmit() {
    this.derivativeService.calculateDerivative(this.functionInput).subscribe(
      res => this.result = res,
      err => console.error(err)
    );
  }

  ngOnInit() {
    console.log("%c 1 --> Line: 53||home.page.ts\n ngOnInit: ","color:#f0f;");

    // Load the default archive from assets when the app starts. If no archive
    // exists or it fails to load, the user can upload one via file input.
    this.chatArchiveService.loadDefaultArchive().subscribe({
      next: (convos) => {
        this.conversations = convos;
        if (this.conversations.length > 0) {
          this.selectedIndex = 0;
        }
      },
      error: (err) => {
        console.warn('Failed to load default archive:', err);
      },
    });




  }


  /**
   * Getter for the currently selected conversation. Returns undefined if
   * nothing has been selected yet.
   */
  get selectedConversation(): ParsedConversation | null {
    if (this.selectedIndex == null || this.selectedIndex < 0 || this.selectedIndex >= this.conversations.length) {
      return null;
    }
    return this.conversations[this.selectedIndex];
  }
  /**
   * Handle user-uploaded JSON archives. The file is read as text, parsed,
   * and the resulting data is forwarded to the parsing service. If the file
   * cannot be parsed, an error is logged.
   */


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          const json = JSON.parse(text);
          const convos = this.chatArchiveService.parseArchiveData(json);
          this.conversations = convos;
          this.selectedIndex = convos.length > 0 ? 0 : null;
        } catch (e) {
          console.error('Failed to parse JSON archive:', e);
        }
      };
      reader.readAsText(file);
    }
  }

}
