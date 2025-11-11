import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { UserRegisterDto, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: UserRegisterDto = {
    name: '',
    email: '',
    password: '',
    role: UserRole.CLIENT
  };

  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    // Validar que las contraseñas coincidan
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        // Redirigir según el rol del usuario
        if (response.user.role === UserRole.ADMIN) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al crear la cuenta. Intenta nuevamente.';
        console.error('Error en registro:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
