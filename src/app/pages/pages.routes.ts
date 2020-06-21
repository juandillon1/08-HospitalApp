import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

import { LoginGuardGuard } from '../services/guards/login-guard.guard';

const pagesRoutes: Routes = [
// pages se crea para separar el login del dashboard
  {
    path: '',
    component: PagesComponent,
    canActivate: [ LoginGuardGuard ],
    // rutas hijas
    children: [
      {path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' }},
      {path: 'progress', component: ProgressComponent, data: { titulo: 'Progreso' }},
      {path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' }},
      {path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }},
      {path: 'rxjs', component: RxjsComponent, data: { titulo: 'RXJS' }},
      {path: 'settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes Del Tema' }},
      {path: '', pathMatch: 'full', redirectTo: '/dashboard'}
    ]
  }

];
@NgModule({
    imports: [RouterModule.forChild(pagesRoutes)],
    exports: [RouterModule]
  })
  export class PagesRoutingModule { }
