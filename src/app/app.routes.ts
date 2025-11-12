import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ProfileComponent } from './components/profile/profile.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { FlightsComponent } from './components/flights/flights.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { AuthGuard, AdminGuard, ClientGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'vuelos', component: FlightsComponent },

  // Rutas protegidas
  { path: 'mi-perfil', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'mis-reservas', component: MyBookingsComponent, canActivate: [AuthGuard] },
  { path: 'reservar/:flightId', component: BookingFormComponent, canActivate: [AuthGuard] },
  // { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },

  { path: '**', redirectTo: '' } // Redirect cualquier ruta no encontrada al home
];
