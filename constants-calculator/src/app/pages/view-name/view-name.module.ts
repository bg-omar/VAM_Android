import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ViewNameComponent} from "./view-name.component";
import {ViewNameRoutingModule} from "./view-name-routing.module";
import {ConstantsListComponent} from "../../constants-list/constants-list.component";
import {LatexParagraphComponent} from "../../latex-paragraph/latex-paragraph.component";
import {VlcComponent} from "../vlc/vlc.component";


const routes: Routes = [
  {
    path: '',
    component: ViewNameComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    CommonModule,
    IonicModule,
    ViewNameComponent,
    ViewNameRoutingModule, ConstantsListComponent, LatexParagraphComponent,
  ],
  declarations: [  ],
  exports: [RouterModule],
})
export class ViewNameModule { }
