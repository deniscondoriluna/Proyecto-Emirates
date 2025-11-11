import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard, adminGuard, clientGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },

  // Rutas protegidas (ejemplo, agregarás más después)
  // { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  // { path: 'mi-perfil', component: ProfileComponent, canActivate: [authGuard] },
  // { path: 'vuelos', component: FlightsComponent, canActivate: [clientGuard] },

  { path: '**', redirectTo: '' } // Redirect cualquier ruta no encontrada al home
];
