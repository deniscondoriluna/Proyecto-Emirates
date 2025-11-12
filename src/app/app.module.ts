import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

import { routes } from './app.routes';
import { ProfileComponent } from './components/profile/profile.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { FlightsComponent } from './components/flights/flights.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

@NgModule({
  declarations: [
    AppComponent,
    Header,
    Footer,
    Home,
    Login,
    Register,
    ProfileComponent,
    MyBookingsComponent,
    FlightsComponent,
    BookingFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
