import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth';
import { Flight, FlightClass } from '../../models/flight.model';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  isLoading = true;
  selectedFlight: Flight | null = null;
  isAuthenticated = false;

  // Filtros
  searchOrigin = '';
  searchDestination = '';
  selectedDate: string = '';

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadFlights();
  }

  checkAuthentication(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        this.isAuthenticated = user !== null;
      }
    });
  }

  loadFlights(): void {
    this.isLoading = true;
    this.bookingService.getAvailableFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        this.filteredFlights = flights;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar vuelos:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredFlights = this.flights.filter(flight => {
      const matchesOrigin = !this.searchOrigin ||
        flight.origin.toLowerCase().includes(this.searchOrigin.toLowerCase());
      const matchesDestination = !this.searchDestination ||
        flight.destination.toLowerCase().includes(this.searchDestination.toLowerCase());
      const matchesDate = !this.selectedDate ||
        this.formatDateForInput(flight.departureDate) === this.selectedDate;

      return matchesOrigin && matchesDestination && matchesDate;
    });
  }

  clearFilters(): void {
    this.searchOrigin = '';
    this.searchDestination = '';
    this.selectedDate = '';
    this.filteredFlights = this.flights;
  }

  selectFlightForBooking(flight: Flight): void {
    if (!this.isAuthenticated) {
      alert('Debes iniciar sesión para reservar un vuelo');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/vuelos' } });
      return;
    }

    // Navegar al formulario de reserva con el ID del vuelo
    this.router.navigate(['/reservar', flight.id]);
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

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getAvailableSeatsText(flight: Flight): string {
    const total = flight.availableSeats.economy +
                  flight.availableSeats.business +
                  flight.availableSeats.firstClass;
    return `${total} asientos disponibles`;
  }
}
