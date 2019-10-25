import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { environment } from 'src/environments/environment';

import { InicioComponent } from '../app/paginas/inicio/inicio.component';
const routes: Routes = [
    {
      path:'',
      component: InicioComponent
    },
    {
      path:'inicio',
      component: InicioComponent
    },
];


export const  routing : ModuleWithProviders = RouterModule.forRoot(routes);
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFireAuthModule,           
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
