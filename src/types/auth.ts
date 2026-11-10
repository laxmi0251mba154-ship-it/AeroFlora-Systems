/**
 * AeroFlora Systems - Authentication Types
 * Real-world email-based login, registration, and user session management
 */

import { UserRole } from './aeroflora';

export interface AuthUser {
  id: string;
  loginId: string;
  email: string;
  fullName: string;
  role: UserRole;
  authProvider: 'credentials' | 'google';
  organization?: string;
  mobileNumber?: string;
  state?: string;
  district?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  token?: string;
}

export interface LoginCredentials {
  loginIdOrEmail: string;
  email?: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleSignInProfile {
  email: string;
  password?: string;
  fullName: string;
  avatarUrl?: string;
  role?: UserRole;
  organization?: string;
}

export interface SignUpData {
  loginId?: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
  organization?: string;
  mobileNumber?: string;
  state?: string;
  district?: string;
}

export interface PasswordResetRequest {
  email: string;
  resetCode: string;
  newPassword?: string;
}
