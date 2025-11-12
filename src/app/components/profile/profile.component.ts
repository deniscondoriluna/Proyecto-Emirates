import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { BookingService } from '../../services/booking.service';
import { User, UserRole } from '../../models/user.model';
import { Booking, BookingStatus } from '../../models/booking.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  editForm = {
    name: '',
    email: ''
  };

  // Para mostrar información adicional
  memberSince: string = '';
  accountType: string = '';

  // Estadísticas de reservas
  userBookings: Booking[] = [];
  totalBookings = 0;
  emiratesPoints = 0;
  recentBookings: Booking[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (!user) {
          // Si no hay usuario, redirigir al login
          this.router.navigate(['/login']);
        } else {
          this.currentUser = user;
          this.editForm.name = user.name;
          this.editForm.email = user.email;

          // Calcular tiempo como miembro
          if (user.createdAt) {
            const createdDate = new Date(user.createdAt);
            this.memberSince = createdDate.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }

          // Determinar tipo de cuenta
          this.accountType = user.role === UserRole.ADMIN ? 'Administrador' : 'Cliente';

          // Cargar reservas del usuario
          this.loadUserBookings(user.id);
        }
      }
    });
  }

  loadUserBookings(userId: string): void {
    this.bookingService.getUserBookings(userId).subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
        this.totalBookings = bookings.length;

        // Calcular puntos Emirates basado en el total gastado
        // Fórmula: $1 = 1 punto
        let totalSpent = 0;
        bookings.forEach(booking => {
          if (booking.status !== BookingStatus.CANCELLED) {
            totalSpent += booking.totalPrice;
          }
        });
        this.emiratesPoints = Math.floor(totalSpent);

        // Obtener las 3 reservas más recientes
        this.recentBookings = bookings
          .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentUser) {
      // Restaurar valores originales si se cancela
      this.editForm.name = this.currentUser.name;
      this.editForm.email = this.currentUser.email;
    }
  }

  saveChanges(): void {
    // Aquí implementarías la lógica para guardar cambios
    console.log('Guardando cambios:', this.editForm);
    // Por ahora solo mostramos un mensaje
    alert('Funcionalidad de edición disponible próximamente');
    this.isEditing = false;
  }

  getRoleBadgeClass(): string {
    return this.currentUser?.role === UserRole.ADMIN ? 'badge bg-danger' : 'badge bg-primary';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
  }

  getStatusBadgeClass(status: BookingStatus): string {
    return this.bookingService.getStatusBadgeClass(status);
  }

  getStatusText(status: BookingStatus): string {
    return this.bookingService.getStatusText(status);
  }
}
