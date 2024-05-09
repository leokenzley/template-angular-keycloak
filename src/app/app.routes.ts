import { Routes } from '@angular/router';
import { LoginSuccessComponent } from './page/authenticated/login-success/login-success.component';
import { HomeComponent } from './page/public/home/home.component';
//import { DefaultAuthGuardService } from './security/authguard/default-auth-guard.service';


export const routes: Routes = [
    { path: 'login-success', component: LoginSuccessComponent},
    
    
    { path: 'inicio', component: HomeComponent},
    { path: '', component: HomeComponent},
];
