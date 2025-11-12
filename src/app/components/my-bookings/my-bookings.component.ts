import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../models/booking.model';
import { FlightClass } from '../../models/flight.model';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;
  selectedBooking: Booking | null = null;
  showDetailModal = false;

  // Filtros
  filterStatus: string = 'all';

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadBookings(currentUser.id);
  }

  loadBookings(userId: string): void {
    this.isLoading = true;
    this.bookingService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredBookings(): Booking[] {
    if (this.filterStatus === 'all') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.filterStatus);
  }

  get upcomingBookings(): Booking[] {
    const now = new Date();
    return this.bookings.filter(b =>
      new Date(b.flight.departureDate) > now &&
      b.status === BookingStatus.CONFIRMED
    );
  }

  get pastBookings(): Booking[] {
    const now = new Date();
    return this.bookings.filter(b =>
      new Date(b.flight.departureDate) <= now ||
      b.status === BookingStatus.COMPLETED
    );
  }

  viewBookingDetail(booking: Booking): void {
    this.selectedBooking = booking;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedBooking = null;
  }

  cancelBooking(bookingId: string): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        // Recargar reservas
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          this.loadBookings(currentUser.id);
        }
        alert('Reserva cancelada exitosamente');
        this.closeDetailModal();
      },
      error: (error) => {
        console.error('Error al cancelar reserva:', error);
        alert('Error al cancelar la reserva');
      }
    });
  }

  getFlightClassName(flightClass: FlightClass): string {
    return this.bookingService.getFlightClassName(flightClass);
  }

  getStatusBadgeClass(status: BookingStatus): string {
    return this.bookingService.getStatusBadgeClass(status);
  }

  getStatusText(status: BookingStatus): string {
    return this.bookingService.getStatusText(status);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
  }

  downloadItinerary(booking: Booking): void {
    // Funcionalidad para descargar itinerario (simulada)
    alert(`Descargando itinerario para reserva ${booking.confirmationCode}`);
  }

  canCancelBooking(booking: Booking): boolean {
    // Se puede cancelar si está confirmada y el vuelo es en el futuro
    const departureDate = new Date(booking.flight.departureDate);
    const now = new Date();
    return booking.status === BookingStatus.CONFIRMED && departureDate > now;
  }
}
