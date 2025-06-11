import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VamComponent } from './vam.component';

const routes: Routes = [
  {
    path: '',
    component: VamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VamRoutingModule { }
