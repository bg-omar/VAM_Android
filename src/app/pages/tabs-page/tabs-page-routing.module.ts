import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';



const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
          }
        ]
      },
      {
        path: 'vlc',
        children: [
          {
            path: '',
            loadChildren: () => import('../vlc/vlc.module').then(m => m.VlcModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomeModule)
          }
        ]
      },
      {
        path: 'differentiator',
        children: [
          {
            path: '',
            loadChildren: () => import('../differentiator/differentiator.module').then(m => m.DifferentiatorModule)
          }
        ]
      },
      {
        path: 'viewname',
        children: [
          {
            path: '',
            loadChildren: () => import('../view-name/view-name.module').then(m => m.ViewNameModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
