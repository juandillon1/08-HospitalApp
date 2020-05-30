import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const sharedRoutes: Routes = [
    {path: '**', component: NopagefoundComponent}

];
@NgModule({
        imports: [RouterModule.forChild(sharedRoutes)],
        exports: [RouterModule]
      })
      export class SharedRoutingModule { }
