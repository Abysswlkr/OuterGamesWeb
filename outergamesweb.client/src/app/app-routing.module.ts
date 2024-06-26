import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { authGuard } from './components/authGuard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VideogamesComponent } from './components/videogames/videogames.component';
import { LoggedInGuard } from './components/loggedIn';
import { PaymentComponent } from './components/payment/payment.component';
import { LandingComponent } from './components/landing/landing.component';
import { VideogameComponent } from './components/videogame/videogame.component';
import { ManagementComponent } from './components/management/management.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo:'landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent}, 
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  { path: 'videogames', component: VideogamesComponent },
  { path: 'videogame/:id', component: VideogameComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'cart', component: CartComponent, canActivate: [authGuard]},
  { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'management', component: ManagementComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
