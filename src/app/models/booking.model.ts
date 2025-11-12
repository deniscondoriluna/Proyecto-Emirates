import { Flight, FlightClass } from './flight.model';

// Enum para el estado de la reserva
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Interface para pasajero
export interface Passenger {
  firstName: string;
  lastName: string;
  documentType: string; // "Pasaporte", "DNI"
  documentNumber: string;
  dateOfBirth: Date;
  nationality: string;
}

// Interface para extras de la reserva
export interface BookingExtras {
  airportTransfer?: boolean;
  extraLuggage?: number; // kg adicionales
  mealPreference?: string; // "vegetariano", "vegano", "sin gluten", etc.
  specialAssistance?: string;
}

// Interface principal de reserva
export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  flight: Flight;
  flightClass: FlightClass;
  passengers: Passenger[];
  seatNumbers: string[]; // ["12A", "12B"]
  totalPrice: number;
  extras?: BookingExtras;
  status: BookingStatus;
  bookingDate: Date;
  paymentMethod?: string;
  confirmationCode: string; // código de 6 caracteres
}

// DTO para crear una reserva
export interface CreateBookingDto {
  userId: string;
  flightId: string;
  flightClass: FlightClass;
  passengers: Passenger[];
  extras?: BookingExtras;
}
