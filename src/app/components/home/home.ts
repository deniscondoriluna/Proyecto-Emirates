import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  featuredFlights: Flight[] = [];
  isLoading = true;
  isAuthenticated = false;

  // Datos de destinos populares
  popularDestinations = [
    {
      city: 'Dubai',
      country: 'Emiratos Árabes Unidos',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
      priceFrom: 1200
    },
    {
      city: 'Londres',
      country: 'Reino Unido',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
      priceFrom: 1100
    },
    {
      city: 'París',
      country: 'Francia',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      priceFrom: 1350
    },
    {
      city: 'Nueva York',
      country: 'Estados Unidos',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
      priceFrom: 1500
    }
  ];

  // Servicios destacados
  services = [
    {
      icon: 'bi-wifi',
      title: 'WiFi Gratis',
      description: 'Mantente conectado durante todo el vuelo'
    },
    {
      icon: 'bi-tv',
      title: 'Entretenimiento',
      description: 'Miles de películas, series y música'
    },
    {
      icon: 'bi-egg-fried',
      title: 'Comida Gourmet',
      description: 'Menús preparados por chefs reconocidos'
    },
    {
      icon: 'bi-star-fill',
      title: 'Servicio Premium',
      description: 'Atención de clase mundial'
    }
  ];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedFlights();
    this.checkAuthentication();
  }

  loadFeaturedFlights(): void {
    this.isLoading = true;
    this.bookingService.getAvailableFlights().subscribe({
      next: (flights) => {
        this.featuredFlights = flights.slice(0, 3); // Mostrar solo 3 vuelos
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar vuelos:', error);
        this.isLoading = false;
      }
    });
  }

  checkAuthentication(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        this.isAuthenticated = user !== null;
      }
    });
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  navigateToBooking(flight?: Flight): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: flight ? `/reservar/${flight.id}` : '/vuelos' } });
      return;
    }

    if (flight) {
      // Si se proporciona un vuelo, ir directamente al formulario de reserva
      this.router.navigate(['/reservar', flight.id]);
    } else {
      // Si no, ir al catálogo de vuelos
      this.router.navigate(['/vuelos']);
    }
  }
}
