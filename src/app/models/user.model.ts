export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client'
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserRegisterDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token?: string;
}
