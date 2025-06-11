import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'differentiator',
    loadChildren: () =>
      import('./pages/differentiator/differentiator.module').then(
        (m) => m.DifferentiatorModule
      ),
  },
  {
    path: 'viewname',
    loadChildren: () =>
      import('./pages/view-name/view-name.module').then(
        (m) => m.ViewNameModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'vlc',
    loadChildren: () =>
      import('./pages/vlc/vlc.module').then((m) => m.VlcModule),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./pages/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'pestop',
    loadComponent: () =>
      import('./pestop/pestop.component').then((m) => m.PestopComponent),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/tabs-page/tabs-page.module').then((m) => m.TabsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
