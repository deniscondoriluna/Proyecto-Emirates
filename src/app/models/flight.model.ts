// Enums para las clases de vuelo
export enum FlightClass {
  ECONOMY = 'economy',
  BUSINESS = 'business',
  FIRST_CLASS = 'first_class'
}

// Enum para el estado del vuelo
export enum FlightStatus {
  SCHEDULED = 'scheduled',
  BOARDING = 'boarding',
  DELAYED = 'delayed',
  DEPARTED = 'departed',
  ARRIVED = 'arrived',
  CANCELLED = 'cancelled'
}

// Interface para representar un vuelo
export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
  arrivalTime: string;
  duration: string; // ejemplo: "8h 30m"
  aircraft: string; // ejemplo: "A380"
  status: FlightStatus;
  pricing: {
    economy: number;
    business: number;
    firstClass: number;
  };
  availableSeats: {
    economy: number;
    business: number;
    firstClass: number;
  };
  amenities: string[]; // ["WiFi", "Entretenimiento", "Comida"]
}
