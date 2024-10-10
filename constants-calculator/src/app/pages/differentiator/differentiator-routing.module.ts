import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {DifferentiatorComponent} from "./differentiator.component";

const routes: Routes = [
  {
    path: '',
    component: DifferentiatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DifferentiatorRoutingModule { }
