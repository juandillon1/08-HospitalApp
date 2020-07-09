import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { PagesComponent } from './pages/pages.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  // Se cargan las páginas con lazy load (loadchildren)
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuardGuard],
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: '**',  component: NopagefoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
