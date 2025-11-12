import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, UserRegisterDto, UserLoginDto, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Simulación de base de datos en localStorage
  private readonly USERS_KEY = 'emirates_users';
  private readonly CURRENT_USER_KEY = 'emirates_current_user';

  constructor() {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Inicializar con usuarios de prueba si no existen
    this.initializeTestUsers();
  }

  private initializeTestUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      // Usuario administrador por defecto
      const adminUser: User = {
        id: '1',
        email: 'admin@emirates.com',
        password: 'admin123',
        name: 'Administrador Emirates',
        role: UserRole.ADMIN,
        createdAt: new Date()
      };

      // Usuario cliente por defecto
      const clientUser: User = {
        id: '2',
        email: 'cliente@example.com',
        password: 'cliente123',
        name: 'Cliente Ejemplo',
        role: UserRole.CLIENT,
        createdAt: new Date()
      };

      localStorage.setItem(this.USERS_KEY, JSON.stringify([adminUser, clientUser]));
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === UserRole.ADMIN;
  }

  public get isClient(): boolean {
    return this.currentUserValue?.role === UserRole.CLIENT;
  }

  login(loginDto: UserLoginDto): Observable<AuthResponse> {
    // Simulamos una llamada HTTP con delay
    return of(null).pipe(
      delay(500),
      map(() => {
        const users = this.getUsers();
        const user = users.find(
          u => u.email === loginDto.email && u.password === loginDto.password
        );

        if (!user) {
          throw new Error('Email o contraseña incorrectos');
        }

        // Guardamos el usuario actual (sin la contraseña)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword as User);

        return {
          user: userWithoutPassword,
          token: `fake-jwt-token-${user.id}`
        };
      })
    );
  }

  register(registerDto: UserRegisterDto): Observable<AuthResponse> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const users = this.getUsers();

        // Verificar si el email ya existe
        if (users.some(u => u.email === registerDto.email)) {
          throw new Error('El email ya está registrado');
        }

        // Crear nuevo usuario
        const newUser: User = {
          id: Date.now().toString(),
          ...registerDto,
          createdAt: new Date()
        };

        users.push(newUser);
        this.saveUsers(users);

        // Auto-login después del registro
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword as User);

        return {
          user: userWithoutPassword,
          token: `fake-jwt-token-${newUser.id}`
        };
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
  }

  // Método para obtener el usuario actual como Promise (útil para guards)
  getCurrentUserPromise(): Promise<User | null> {
    return Promise.resolve(this.currentUserValue);
  }
}
