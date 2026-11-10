/**
 * AeroFlora Systems - Authentication Service
 * Complete client & persistent storage authentication supporting:
 * - Login ID & Email / Password authentication
 * - Sign In with Google (with interactive account picker & profile provisioning)
 * - Mandatory Login ID verification on session access
 * - User registration, session tokens, profile updates, and password resets.
 */

import { AuthUser, LoginCredentials, SignUpData, GoogleSignInProfile } from '../types/auth';

export const AUTH_STORAGE_KEYS = {
  AUTH_USER: 'AEROFLORA_CURRENT_AUTH_USER',
  USER_REGISTRY: 'AEROFLORA_USER_REGISTRY',
  RESET_CODES: 'AEROFLORA_PASSWORD_RESET_CODES',
  REQUIRE_LOGIN_GATE: 'AEROFLORA_REQUIRE_LOGIN_ON_VISIT',
};

interface StoredAccount {
  user: AuthUser;
  passwordHash: string;
}

// Built-in realistic user accounts with designated Login IDs
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      id: 'usr-laxmi-01',
      loginId: '0251MBA154',
      email: 'laxmi.0251mba154@dgu.ac.in',
      fullName: 'Laxmi Kant Sharma',
      role: 'platform_admin',
      authProvider: 'google',
      organization: 'DGU Venture Quest / AgTech Research',
      mobileNumber: '+91 98290 14521',
      state: 'Rajasthan',
      district: 'Jaipur',
      emailVerified: true,
      createdAt: '2026-01-15T09:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    passwordHash: 'AeroFlora@2026',
  },
  {
    user: {
      id: 'usr-ramesh-patel',
      loginId: 'AF-RAMESH-26',
      email: 'ramesh.patel@agroindia.org',
      fullName: 'Ramesh Patel',
      role: 'farmer',
      authProvider: 'credentials',
      organization: 'Shree Krishna Krishi Farm',
      mobileNumber: '+91 98250 12345',
      state: 'Gujarat',
      district: 'Banaskantha',
      emailVerified: true,
      createdAt: '2026-02-01T10:30:00.000Z',
      lastLoginAt: '2026-11-01T14:20:00.000Z',
      avatarUrl: '',
    },
    passwordHash: 'Kisan@2026',
  },
  {
    user: {
      id: 'usr-dr-raman',
      loginId: 'AF-ICAR-DR26',
      email: 'dr.venkat.raman@icar-crida.res.in',
      fullName: 'Dr. Venkat Raman',
      role: 'agronomist',
      authProvider: 'credentials',
      organization: 'ICAR - Central Research Institute for Dryland Agriculture',
      mobileNumber: '+91 94401 88231',
      state: 'Telangana',
      district: 'Hyderabad',
      emailVerified: true,
      createdAt: '2026-01-20T11:15:00.000Z',
      lastLoginAt: '2026-10-28T16:45:00.000Z',
      avatarUrl: '',
    },
    passwordHash: 'Science@2026',
  },
  {
    user: {
      id: 'usr-sunita-fpo',
      loginId: 'AF-FPO-NASHIK',
      email: 'sunita.deshmukh@maharashtrafpo.org',
      fullName: 'Sunita Deshmukh',
      role: 'fpo_admin',
      authProvider: 'credentials',
      organization: 'Sahyadri Farmers Producer Co-operative Ltd',
      mobileNumber: '+91 98220 54321',
      state: 'Maharashtra',
      district: 'Nashik',
      emailVerified: true,
      createdAt: '2026-02-10T08:00:00.000Z',
      lastLoginAt: '2026-10-30T11:10:00.000Z',
      avatarUrl: '',
    },
    passwordHash: 'Kisan@2026',
  },
  {
    user: {
      id: 'usr-admin-aeroflora',
      loginId: 'ADMIN-AF-2026',
      email: 'admin@aeroflora.in',
      fullName: 'AeroFlora System Administrator',
      role: 'platform_admin',
      authProvider: 'credentials',
      organization: 'AeroFlora Systems Private Limited',
      mobileNumber: '+91 99990 00111',
      state: 'Delhi',
      district: 'New Delhi',
      emailVerified: true,
      createdAt: '2025-11-01T00:00:00.000Z',
      lastLoginAt: '2026-11-02T19:00:00.000Z',
      avatarUrl: '',
    },
    passwordHash: 'Admin@2026',
  },
];

// Helper to load registered accounts from local storage
export function getAccountsRegistry(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USER_REGISTRY);
    if (!raw) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_REGISTRY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed: StoredAccount[] = JSON.parse(raw);
    const existingEmails = new Set(parsed.map((a: StoredAccount) => a.user.email.toLowerCase()));
    let updated = false;

    for (const def of DEFAULT_ACCOUNTS) {
      const found = parsed.find(
        (a) => a.user.email.toLowerCase() === def.user.email.toLowerCase() || a.user.id === def.user.id
      );
      if (!found) {
        parsed.push(def);
        updated = true;
      } else {
        // Upgrade legacy records that may not have loginId or authProvider
        if (!found.user.loginId || !found.user.authProvider) {
          found.user.loginId = found.user.loginId || def.user.loginId;
          found.user.authProvider = found.user.authProvider || def.user.authProvider;
          updated = true;
        }
      }
    }

    if (updated) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER_REGISTRY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read user registry:', err);
    return DEFAULT_ACCOUNTS;
  }
}

function saveAccountsRegistry(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER_REGISTRY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save user registry:', err);
  }
}

// Generate realistic mock JWT token
function generateToken(user: AuthUser): string {
  const payload = {
    sub: user.id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    iss: 'aeroflora-systems',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return 'ey' + btoa(JSON.stringify(payload)) + '.' + Math.random().toString(36).substring(2, 15);
}

/**
 * Log in a user with either Login ID, Username, or Email Address & Password
 */
export async function loginWithEmail(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
  return loginWithCredentials(credentials);
}

export async function loginWithCredentials(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
  // Simulate standard network latency for authenticity
  await new Promise((resolve) => setTimeout(resolve, 450));

  const identifier = (credentials.loginIdOrEmail || credentials.email || '').trim();
  const password = credentials.password;

  if (!identifier) {
    throw new Error('Please enter your Login ID or Email Address.');
  }

  if (!password) {
    throw new Error('Please enter your account password.');
  }

  const registry = getAccountsRegistry();
  const idLower = identifier.toLowerCase();
  const digitsOnly = identifier.replace(/\D/g, '');

  // Look up account matching Login ID, Email, ID, Mobile, or username
  const foundAccount = registry.find((acc) => {
    const u = acc.user;
    if (u.loginId && u.loginId.toLowerCase() === idLower) return true;
    if (u.email && u.email.toLowerCase() === idLower) return true;
    if (u.id && u.id.toLowerCase() === idLower) return true;
    if (u.email && u.email.toLowerCase().split('@')[0] === idLower) return true;
    if (digitsOnly.length >= 8 && u.mobileNumber && u.mobileNumber.replace(/\D/g, '').includes(digitsOnly)) return true;
    return false;
  });

  if (!foundAccount) {
    throw new Error(
      `No AeroFlora account found with Login ID or Email "${identifier}". Please check your ID or click "Continue with Google".`
    );
  }

  // Password verification
  if (foundAccount.passwordHash !== password) {
    throw new Error('Incorrect password. Please verify your credentials or click "Forgot Password".');
  }

  // Login successful
  const updatedUser: AuthUser = {
    ...foundAccount.user,
    lastLoginAt: new Date().toISOString(),
  };

  const token = generateToken(updatedUser);
  updatedUser.token = token;

  // Update in registry
  foundAccount.user = updatedUser;
  saveAccountsRegistry(registry);

  // Store in active session
  setCurrentUser(updatedUser);

  return { user: updatedUser, token };
}

/**
 * Sign In with Google
 * Requires verified Google email and account password. Password verification is strictly enforced.
 */
export async function loginWithGoogle(profile: GoogleSignInProfile): Promise<{ user: AuthUser; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const emailTrimmed = profile.email.trim().toLowerCase();
  if (!emailTrimmed) {
    throw new Error('Google authentication failed: Email address is required.');
  }

  const password = (profile.password || '').trim();
  if (!password) {
    throw new Error('Please enter your account password to verify your Google identity.');
  }

  const registry = getAccountsRegistry();
  let foundAccount = registry.find((acc) => acc.user.email.toLowerCase() === emailTrimmed);

  if (foundAccount) {
    // Existing account: verify password
    if (foundAccount.passwordHash !== password) {
      throw new Error('Incorrect password for this account. Please verify your password or use Password Reset.');
    }

    foundAccount.user = {
      ...foundAccount.user,
      fullName: profile.fullName || foundAccount.user.fullName,
      authProvider: 'google',
      emailVerified: true,
      lastLoginAt: new Date().toISOString(),
      avatarUrl: profile.avatarUrl || foundAccount.user.avatarUrl,
    };
  } else {
    // New Google account: enforce minimum password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanPrefix = emailTrimmed.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newLoginId = cleanPrefix.length > 3 ? cleanPrefix : `GOOGLE-${Date.now().toString(36).toUpperCase()}`;

    const newUser: AuthUser = {
      id: 'usr-google-' + Date.now().toString(36),
      loginId: newLoginId,
      email: emailTrimmed,
      fullName: profile.fullName || emailTrimmed.split('@')[0],
      role: profile.role || 'farmer',
      authProvider: 'google',
      organization: profile.organization || 'Google Verified AgTech User',
      avatarUrl: profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      emailVerified: true,
      state: 'Rajasthan',
      district: 'Jaipur',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    foundAccount = {
      user: newUser,
      passwordHash: password,
    };

    registry.push(foundAccount);
  }

  const token = generateToken(foundAccount.user);
  foundAccount.user.token = token;

  saveAccountsRegistry(registry);
  setCurrentUser(foundAccount.user);

  return { user: foundAccount.user, token };
}

/**
 * Register a new user with email, Login ID, and password
 */
export async function signUpWithEmail(data: SignUpData): Promise<{ user: AuthUser; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const emailTrimmed = data.email.trim().toLowerCase();

  if (!data.fullName || data.fullName.trim().length < 2) {
    throw new Error('Please enter your full name.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match. Please re-enter.');
  }

  const registry = getAccountsRegistry();
  const exists = registry.some((acc) => acc.user.email.toLowerCase() === emailTrimmed);

  if (exists) {
    throw new Error(`An account with email "${data.email}" already exists. Please sign in instead.`);
  }

  // Generate or use custom Login ID
  const rawId = data.loginId?.trim().toUpperCase() ||
    'AF-' + data.fullName.split(' ')[0].toUpperCase() + '-' + Math.floor(10 + Math.random() * 90);

  const newUser: AuthUser = {
    id: 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    loginId: rawId,
    email: emailTrimmed,
    fullName: data.fullName.trim(),
    role: data.role || 'farmer',
    authProvider: 'credentials',
    organization: data.organization || (data.role === 'farmer' ? 'Krishi Farm' : 'AgriTech Partner'),
    mobileNumber: data.mobileNumber || '',
    state: data.state || 'Rajasthan',
    district: data.district || '',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  const token = generateToken(newUser);
  newUser.token = token;

  registry.push({
    user: newUser,
    passwordHash: data.password,
  });

  saveAccountsRegistry(registry);
  setCurrentUser(newUser);

  return { user: newUser, token };
}

/**
 * Request password reset code
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; resetCode: string; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const emailTrimmed = email.trim().toLowerCase();
  const registry = getAccountsRegistry();
  const found = registry.find((acc) => acc.user.email.toLowerCase() === emailTrimmed);

  if (!found) {
    throw new Error(`Email "${email}" is not registered on AeroFlora Systems.`);
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const rawCodes = localStorage.getItem(AUTH_STORAGE_KEYS.RESET_CODES) || '{}';
    const codes = JSON.parse(rawCodes);
    codes[emailTrimmed] = {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    };
    localStorage.setItem(AUTH_STORAGE_KEYS.RESET_CODES, JSON.stringify(codes));
  } catch (e) {
    console.error('Error saving reset code:', e);
  }

  return {
    success: true,
    resetCode: code,
    message: `Verification code generated for ${email}. (Demo Code: ${code})`,
  };
}

/**
 * Confirm password reset and update credentials
 */
export async function confirmPasswordReset(email: string, code: string, newPassword: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const emailTrimmed = email.trim().toLowerCase();
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  try {
    const rawCodes = localStorage.getItem(AUTH_STORAGE_KEYS.RESET_CODES) || '{}';
    const codes = JSON.parse(rawCodes);
    const record = codes[emailTrimmed];

    if (!record || record.code !== code.trim()) {
      throw new Error('Invalid verification code. Please check and try again.');
    }
  } catch (err: any) {
    if (err.message) throw err;
  }

  const registry = getAccountsRegistry();
  const index = registry.findIndex((acc) => acc.user.email.toLowerCase() === emailTrimmed);
  if (index === -1) {
    throw new Error('User account not found.');
  }

  registry[index].passwordHash = newPassword;
  saveAccountsRegistry(registry);

  return true;
}

/**
 * Get the currently logged-in user session
 * Requires explicit session activity so user is not automatically logged in on page load
 */
export function getCurrentUser(): AuthUser | null {
  try {
    // When login is required every time, always start unauthenticated so user is prompted for credentials
    if (isLoginRequiredEveryTime()) {
      return null;
    }
    if (typeof window !== 'undefined') {
      const sessionActive = sessionStorage.getItem('AEROFLORA_SESSION_ACTIVE');
      if (sessionActive !== 'true') {
        localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_USER);
        return null;
      }
    }
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.AUTH_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Set or clear the current active session
 */
export function setCurrentUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_USER);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('AEROFLORA_SESSION_ACTIVE');
      }
    } else {
      localStorage.setItem(AUTH_STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('AEROFLORA_SESSION_ACTIVE', 'true');
      }
    }
  } catch (err) {
    console.error('Failed to set current user:', err);
  }
}

/**
 * Sign out the current user
 */
export function logoutUser(): void {
  setCurrentUser(null);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem('AEROFLORA_SESSION_ACTIVE');
      localStorage.removeItem(AUTH_STORAGE_KEYS.AUTH_USER);
    } catch {
      // ignore
    }
  }
}

/**
 * Update user profile
 */
export function updateUserProfile(userId: string, updates: Partial<AuthUser>): AuthUser {
  const registry = getAccountsRegistry();
  const index = registry.findIndex((acc) => acc.user.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }

  const updated: AuthUser = {
    ...registry[index].user,
    ...updates,
  };

  registry[index].user = updated;
  saveAccountsRegistry(registry);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updated);
  }

  return updated;
}

/**
 * Fast preset Google profiles for the interactive Google Sign-In Chooser
 */
export function getGooglePresetProfiles(): {
  email: string;
  fullName: string;
  role: 'farmer' | 'agronomist' | 'fpo_admin' | 'technician' | 'platform_admin';
  organization: string;
  badge: string;
  avatarUrl: string;
}[] {
  return [
    {
      email: 'laxmi.0251mba154@dgu.ac.in',
      fullName: 'Laxmi Kant Sharma',
      role: 'platform_admin',
      organization: 'DGU Venture Quest / AgTech Research',
      badge: '🎓 University Google Account',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      email: 'ramesh.patel@agroindia.org',
      fullName: 'Ramesh Patel',
      role: 'farmer',
      organization: 'Shree Krishna Krishi Farm (Gujarat)',
      badge: '🌾 Google Workspace',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      email: 'dr.venkat.raman@icar-crida.res.in',
      fullName: 'Dr. Venkat Raman',
      role: 'agronomist',
      organization: 'ICAR - CRIDA Climate Research',
      badge: '🔬 Research Google ID',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];
}

/**
 * Get available quick-demo profiles with explicit Login IDs for 1-click testing
 */
export function getQuickDemoProfiles(): {
  loginId: string;
  email: string;
  name: string;
  role: string;
  roleLabel: string;
  password: string;
}[] {
  return [
    {
      loginId: '0251MBA154',
      email: 'laxmi.0251mba154@dgu.ac.in',
      name: 'Laxmi Kant Sharma',
      role: 'platform_admin',
      roleLabel: '🎓 Scholar & Director',
      password: 'AeroFlora@2026',
    },
    {
      loginId: 'AF-RAMESH-26',
      email: 'ramesh.patel@agroindia.org',
      name: 'Ramesh Patel',
      role: 'farmer',
      roleLabel: '🌾 Progressive Farmer (Gujarat)',
      password: 'Kisan@2026',
    },
    {
      loginId: 'AF-ICAR-DR26',
      email: 'dr.venkat.raman@icar-crida.res.in',
      name: 'Dr. Venkat Raman',
      role: 'agronomist',
      roleLabel: '🔬 ICAR Climate Scientist',
      password: 'Science@2026',
    },
    {
      loginId: 'AF-FPO-NASHIK',
      email: 'sunita.deshmukh@maharashtrafpo.org',
      name: 'Sunita Deshmukh',
      role: 'fpo_admin',
      roleLabel: '🏢 FPO Executive (Nashik)',
      password: 'Kisan@2026',
    },
    {
      loginId: 'ADMIN-AF-2026',
      email: 'admin@aeroflora.in',
      name: 'System Admin',
      role: 'platform_admin',
      roleLabel: '🛡️ Platform Admin',
      password: 'Admin@2026',
    },
  ];
}

/**
 * Check whether Login ID is required on every visit/session
 */
export function isLoginRequiredEveryTime(): boolean {
  try {
    const val = localStorage.getItem(AUTH_STORAGE_KEYS.REQUIRE_LOGIN_GATE);
    if (val === null) return true; // Default to true as requested by user
    return val === 'true';
  } catch {
    return true;
  }
}

export function setLoginRequiredEveryTime(required: boolean): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.REQUIRE_LOGIN_GATE, required ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to update login requirement setting:', err);
  }
}
