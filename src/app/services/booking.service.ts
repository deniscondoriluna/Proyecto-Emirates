import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Booking, BookingStatus, CreateBookingDto } from '../models/booking.model';
import { Flight, FlightStatus, FlightClass } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly BOOKINGS_KEY = 'emirates_bookings';
  private readonly FLIGHTS_KEY = 'emirates_flights';

  private bookingsSubject: BehaviorSubject<Booking[]>;
  public bookings$: Observable<Booking[]>;

  constructor() {
    const storedBookings = localStorage.getItem(this.BOOKINGS_KEY);
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    this.bookingsSubject = new BehaviorSubject<Booking[]>(bookings);
    this.bookings$ = this.bookingsSubject.asObservable();

    // Inicializar con vuelos de ejemplo
    this.initializeSampleFlights();
    // Inicializar con reservas de ejemplo
    this.initializeSampleBookings();
  }

  private initializeSampleFlights(): void {
    const flights = this.getFlights();
    if (flights.length === 0) {
      const sampleFlights: Flight[] = [
        {
          id: '1',
          flightNumber: 'EK201',
          origin: 'Santiago (SCL)',
          destination: 'Dubai (DXB)',
          departureDate: new Date(2025, 11, 15), // 15 de diciembre 2025
          departureTime: '22:30',
          arrivalTime: '18:45+1',
          duration: '16h 15m',
          aircraft: 'Boeing 777-300ER',
          status: FlightStatus.SCHEDULED,
          pricing: {
            economy: 1200,
            business: 4500,
            firstClass: 8500
          },
          availableSeats: {
            economy: 45,
            business: 12,
            firstClass: 4
          },
          amenities: ['WiFi', 'Entretenimiento a bordo', 'Comida gourmet', 'Lounge exclusivo']
        },
        {
          id: '2',
          flightNumber: 'EK202',
          origin: 'Dubai (DXB)',
          destination: 'Santiago (SCL)',
          departureDate: new Date(2025, 11, 22),
          departureTime: '08:15',
          arrivalTime: '18:30',
          duration: '16h 15m',
          aircraft: 'Airbus A380',
          status: FlightStatus.SCHEDULED,
          pricing: {
            economy: 1300,
            business: 4700,
            firstClass: 9000
          },
          availableSeats: {
            economy: 120,
            business: 25,
            firstClass: 8
          },
          amenities: ['WiFi', 'Entretenimiento', 'Bar a bordo', 'Ducha (First Class)']
        },
        {
          id: '3',
          flightNumber: 'EK305',
          origin: 'Santiago (SCL)',
          destination: 'Londres (LHR)',
          departureDate: new Date(2025, 10, 20),
          departureTime: '14:00',
          arrivalTime: '09:30+1',
          duration: '15h 30m',
          aircraft: 'Boeing 787-9',
          status: FlightStatus.SCHEDULED,
          pricing: {
            economy: 1100,
            business: 4200,
            firstClass: 7800
          },
          availableSeats: {
            economy: 85,
            business: 18,
            firstClass: 6
          },
          amenities: ['WiFi', 'Entretenimiento', 'Comida premium']
        }
      ];
      localStorage.setItem(this.FLIGHTS_KEY, JSON.stringify(sampleFlights));
    }
  }

  private initializeSampleBookings(): void {
    const bookings = this.getBookingsFromStorage();
    if (bookings.length === 0) {
      const flights = this.getFlights();
      if (flights.length > 0) {
        // Crear reserva de ejemplo para el usuario cliente (id: '2')
        const sampleBooking: Booking = {
          id: '1',
          userId: '2',
          userName: 'Cliente Ejemplo',
          userEmail: 'cliente@example.com',
          flight: flights[0], // EK201
          flightClass: FlightClass.ECONOMY,
          passengers: [
            {
              firstName: 'Juan',
              lastName: 'Pérez',
              documentType: 'Pasaporte',
              documentNumber: '12345678',
              dateOfBirth: new Date(1990, 5, 15),
              nationality: 'Chilena'
            }
          ],
          seatNumbers: ['12A'],
          totalPrice: 1200,
          extras: {
            airportTransfer: true,
            mealPreference: 'vegetariano'
          },
          status: BookingStatus.CONFIRMED,
          bookingDate: new Date(),
          paymentMethod: 'Tarjeta de crédito',
          confirmationCode: 'ABC123'
        };

        // Crear segunda reserva de ejemplo
        const sampleBooking2: Booking = {
          id: '2',
          userId: '2',
          userName: 'Cliente Ejemplo',
          userEmail: 'cliente@example.com',
          flight: flights[1], // EK202
          flightClass: FlightClass.BUSINESS,
          passengers: [
            {
              firstName: 'María',
              lastName: 'González',
              documentType: 'DNI',
              documentNumber: '87654321',
              dateOfBirth: new Date(1985, 3, 20),
              nationality: 'Chilena'
            },
            {
              firstName: 'Pedro',
              lastName: 'González',
              documentType: 'DNI',
              documentNumber: '11223344',
              dateOfBirth: new Date(2010, 7, 10),
              nationality: 'Chilena'
            }
          ],
          seatNumbers: ['5A', '5B'],
          totalPrice: 9400,
          extras: {
            extraLuggage: 20
          },
          status: BookingStatus.CONFIRMED,
          bookingDate: new Date(2025, 10, 1),
          paymentMethod: 'Transferencia bancaria',
          confirmationCode: 'XYZ789'
        };

        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify([sampleBooking, sampleBooking2]));
        this.bookingsSubject.next([sampleBooking, sampleBooking2]);
      }
    }
  }

  private getFlights(): Flight[] {
    const flights = localStorage.getItem(this.FLIGHTS_KEY);
    return flights ? JSON.parse(flights) : [];
  }

  private getBookingsFromStorage(): Booking[] {
    const bookings = localStorage.getItem(this.BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    this.bookingsSubject.next(bookings);
  }

  // Obtener todas las reservas de un usuario
  getUserBookings(userId: string): Observable<Booking[]> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const bookings = this.getBookingsFromStorage();
        return bookings.filter(b => b.userId === userId);
      })
    );
  }

  // Obtener una reserva por ID
  getBookingById(bookingId: string): Observable<Booking | undefined> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const bookings = this.getBookingsFromStorage();
        return bookings.find(b => b.id === bookingId);
      })
    );
  }

  // Crear una nueva reserva
  createBooking(bookingDto: CreateBookingDto, userName: string, userEmail: string): Observable<Booking> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const flights = this.getFlights();
        const flight = flights.find(f => f.id === bookingDto.flightId);

        if (!flight) {
          throw new Error('Vuelo no encontrado');
        }

        // Calcular precio total
        let pricePerPerson = 0;
        switch (bookingDto.flightClass) {
          case FlightClass.ECONOMY:
            pricePerPerson = flight.pricing.economy;
            break;
          case FlightClass.BUSINESS:
            pricePerPerson = flight.pricing.business;
            break;
          case FlightClass.FIRST_CLASS:
            pricePerPerson = flight.pricing.firstClass;
            break;
        }

        const totalPrice = pricePerPerson * bookingDto.passengers.length;

        // Generar código de confirmación
        const confirmationCode = this.generateConfirmationCode();

        // Generar asientos de ejemplo
        const seatNumbers = bookingDto.passengers.map((_, index) => {
          const row = 10 + index;
          const seat = String.fromCharCode(65 + (index % 6)); // A, B, C, D, E, F
          return `${row}${seat}`;
        });

        const newBooking: Booking = {
          id: Date.now().toString(),
          userId: bookingDto.userId,
          userName: userName,
          userEmail: userEmail,
          flight: flight,
          flightClass: bookingDto.flightClass,
          passengers: bookingDto.passengers,
          seatNumbers: seatNumbers,
          totalPrice: totalPrice,
          extras: bookingDto.extras,
          status: BookingStatus.CONFIRMED,
          bookingDate: new Date(),
          confirmationCode: confirmationCode
        };

        const bookings = this.getBookingsFromStorage();
        bookings.push(newBooking);
        this.saveBookings(bookings);

        return newBooking;
      })
    );
  }

  // Cancelar una reserva
  cancelBooking(bookingId: string): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const bookings = this.getBookingsFromStorage();
        const booking = bookings.find(b => b.id === bookingId);

        if (!booking) {
          throw new Error('Reserva no encontrada');
        }

        booking.status = BookingStatus.CANCELLED;
        this.saveBookings(bookings);

        return true;
      })
    );
  }

  // Obtener todos los vuelos disponibles
  getAvailableFlights(): Observable<Flight[]> {
    return of(null).pipe(
      delay(300),
      map(() => this.getFlights())
    );
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Obtener el nombre de la clase de vuelo en español
  getFlightClassName(flightClass: FlightClass): string {
    switch (flightClass) {
      case FlightClass.ECONOMY:
        return 'Económica';
      case FlightClass.BUSINESS:
        return 'Business';
      case FlightClass.FIRST_CLASS:
        return 'Primera Clase';
      default:
        return 'Desconocida';
    }
  }

  // Obtener el color del badge según el estado
  getStatusBadgeClass(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-success';
      case BookingStatus.PENDING:
        return 'bg-warning';
      case BookingStatus.CANCELLED:
        return 'bg-danger';
      case BookingStatus.COMPLETED:
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  // Obtener el texto del estado en español
  getStatusText(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'Confirmada';
      case BookingStatus.PENDING:
        return 'Pendiente';
      case BookingStatus.CANCELLED:
        return 'Cancelada';
      case BookingStatus.COMPLETED:
        return 'Completada';
      default:
        return 'Desconocido';
    }
  }
}
