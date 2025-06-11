import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {DifferentiatorComponent} from "./differentiator.component";
import {DifferentiatorRoutingModule} from "./differentiator-routing.module";
import {ConstantsListComponent} from "../../constants-list/constants-list.component";
import {LatexParagraphComponent} from "../../latex-paragraph/latex-paragraph.component";



const routes: Routes = [
  {
    path: '',
    component: DifferentiatorComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    CommonModule,
    IonicModule,
    DifferentiatorComponent,
    DifferentiatorRoutingModule, ConstantsListComponent, LatexParagraphComponent,
  ],
  declarations: [  ],
  exports: [RouterModule],
})
export class DifferentiatorModule { }
