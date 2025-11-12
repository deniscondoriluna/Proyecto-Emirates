import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth';
import { Flight, FlightClass } from '../../models/flight.model';
import { Passenger, CreateBookingDto } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  flight: Flight | null = null;
  isLoading = true;
  isSubmitting = false;
  currentStep = 1;
  totalSteps = 3;

  // Selección de clase
  selectedClass: FlightClass = FlightClass.ECONOMY;
  FlightClass = FlightClass; // Para usar en el template

  // Pasajeros
  numberOfPassengers = 1;
  passengers: Passenger[] = [];

  // Extras
  extras = {
    airportTransfer: false,
    extraLuggage: 0,
    mealPreference: '',
    specialAssistance: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const flightId = this.route.snapshot.paramMap.get('flightId');
    if (flightId) {
      this.loadFlight(flightId);
    }
    this.initializePassengers();
  }

  loadFlight(flightId: string): void {
    this.isLoading = true;
    this.bookingService.getAvailableFlights().subscribe({
      next: (flights) => {
        this.flight = flights.find(f => f.id === flightId) || null;
        if (!this.flight) {
          alert('Vuelo no encontrado');
          this.router.navigate(['/vuelos']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar vuelo:', error);
        this.isLoading = false;
        this.router.navigate(['/vuelos']);
      }
    });
  }

  initializePassengers(): void {
    this.passengers = [];
    for (let i = 0; i < this.numberOfPassengers; i++) {
      this.passengers.push({
        firstName: '',
        lastName: '',
        documentType: 'Pasaporte',
        documentNumber: '',
        dateOfBirth: new Date(1990, 0, 1),
        nationality: 'Chilena'
      });
    }
  }

  onNumberOfPassengersChange(): void {
    this.initializePassengers();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validar paso actual antes de avanzar
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      // Validar selección de clase
      return true;
    } else if (this.currentStep === 2) {
      // Validar información de pasajeros
      for (const passenger of this.passengers) {
        if (!passenger.firstName || !passenger.lastName || !passenger.documentNumber) {
          alert('Por favor completa toda la información de los pasajeros');
          return false;
        }
      }
      return true;
    }
    return true;
  }

  calculateTotalPrice(): number {
    if (!this.flight) return 0;

    let pricePerPerson = 0;
    switch (this.selectedClass) {
      case FlightClass.ECONOMY:
        pricePerPerson = this.flight.pricing.economy;
        break;
      case FlightClass.BUSINESS:
        pricePerPerson = this.flight.pricing.business;
        break;
      case FlightClass.FIRST_CLASS:
        pricePerPerson = this.flight.pricing.firstClass;
        break;
    }

    let total = pricePerPerson * this.numberOfPassengers;

    // Agregar costos extras
    if (this.extras.airportTransfer) {
      total += 50 * this.numberOfPassengers; // $50 por persona
    }
    if (this.extras.extraLuggage > 0) {
      total += this.extras.extraLuggage * 10; // $10 por kg
    }

    return total;
  }

  submitBooking(): void {
    if (!this.flight) return;

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;

    const bookingDto: CreateBookingDto = {
      userId: currentUser.id,
      flightId: this.flight.id,
      flightClass: this.selectedClass,
      passengers: this.passengers,
      extras: {
        airportTransfer: this.extras.airportTransfer || undefined,
        extraLuggage: this.extras.extraLuggage > 0 ? this.extras.extraLuggage : undefined,
        mealPreference: this.extras.mealPreference || undefined,
        specialAssistance: this.extras.specialAssistance || undefined
      }
    };

    this.bookingService.createBooking(bookingDto, currentUser.name, currentUser.email).subscribe({
      next: (booking) => {
        this.isSubmitting = false;
        alert(`¡Reserva confirmada! Tu código de confirmación es: ${booking.confirmationCode}`);
        this.router.navigate(['/mis-reservas']);
      },
      error: (error) => {
        this.isSubmitting = false;
        alert('Error al crear la reserva: ' + error.message);
        console.error('Error:', error);
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

  getFlightClassName(flightClass: FlightClass): string {
    return this.bookingService.getFlightClassName(flightClass);
  }

  getClassPrice(flightClass: FlightClass): number {
    if (!this.flight) return 0;

    switch (flightClass) {
      case FlightClass.ECONOMY:
        return this.flight.pricing.economy;
      case FlightClass.BUSINESS:
        return this.flight.pricing.business;
      case FlightClass.FIRST_CLASS:
        return this.flight.pricing.firstClass;
      default:
        return 0;
    }
  }
}
