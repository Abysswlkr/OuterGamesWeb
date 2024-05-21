import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JwtModule } from '@auth0/angular-jwt';
import { VideogamesComponent } from './components/videogames/videogames.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { VideogameComponent } from './components/videogame/videogame.component';
import { ManagementComponent } from './components/management/management.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VideogamesComponent,
    PaymentComponent,
    LandingComponent,
    NavbarComponent,
    FooterComponent,
    VideogameComponent,
    ManagementComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token'); //NGJhZGM5NTItNzA0ZS00OWY3LWI4ZDctN2M3YWRhMmVkMjIzZmNkYTdlODUtZDhhNS00ZGIyLThhMTctMTE1ZDg1ZDliNGQ0
        },
        allowedDomains: ['https://localhost:7017'],
        disallowedRoutes: ['https://localhost:7017/Auth']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
