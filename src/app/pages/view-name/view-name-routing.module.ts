import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewNameComponent } from './view-name.component';

const routes: Routes = [
  {
    path: '',
    component: ViewNameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNameRoutingModule { }
