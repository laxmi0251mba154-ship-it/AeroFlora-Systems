/**
 * AeroFlora Systems - Real Firebase Authentication Service
 * Implements real-world email/password authentication, email verification gating,
 * Google OAuth provider integration, secure password resets, and Firestore profile synchronization.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, setAuthPersistence, createGoogleProvider } from '../lib/firebase';
import { AuthUser } from '../types/auth';
import { UserRole } from '../types/aeroflora';

export interface AuthStateResult {
  firebaseUser: FirebaseUser | null;
  authUser: AuthUser | null;
  isEmailVerified: boolean;
  loading: boolean;
}

/**
 * Executes a Firestore database operation with a strict safety timeout.
 * Prevents network drops or permission rules from hanging authentication.
 */
async function safeFirestoreOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  timeoutMs = 2500
): Promise<T> {
  try {
    const timeoutPromise = new Promise<T>((resolve) =>
      setTimeout(() => resolve(fallback), timeoutMs)
    );
    return await Promise.race([operation(), timeoutPromise]);
  } catch (err) {
    console.warn('Firestore non-blocking operation notice:', err);
    return fallback;
  }
}

// Convert Firebase User + Firestore doc into standard AeroFlora AuthUser
export function mapFirebaseUserToAuthUser(
  fbUser: FirebaseUser,
  profileData?: Partial<AuthUser> | null
): AuthUser {
  const email = fbUser.email || '';
  const cleanId =
    profileData?.loginId ||
    'AF-' +
      (fbUser.displayName?.split(' ')[0] || email.split('@')[0])
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '') +
      '-' +
      fbUser.uid.substring(0, 4).toUpperCase();

  return {
    id: fbUser.uid,
    loginId: cleanId,
    email: email,
    fullName:
      fbUser.displayName ||
      profileData?.fullName ||
      (email ? email.split('@')[0] : 'Agricultural Professional'),
    role: (profileData?.role as UserRole) || 'farmer',
    authProvider:
      fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'credentials',
    organization: profileData?.organization || 'Krishi Farm / AgTech Partner',
    mobileNumber: profileData?.mobileNumber || fbUser.phoneNumber || '',
    state: profileData?.state || 'Rajasthan',
    district: profileData?.district || 'Jaipur',
    avatarUrl: fbUser.photoURL || profileData?.avatarUrl || '',
    emailVerified: fbUser.emailVerified,
    createdAt: profileData?.createdAt || fbUser.metadata.creationTime || new Date().toISOString(),
    lastLoginAt: fbUser.metadata.lastSignInTime || new Date().toISOString(),
    token: fbUser.refreshToken,
  };
}

// Parse Firebase Auth Error Codes into user-friendly messages
export function parseAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected authentication error occurred.';
  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is currently disabled in your Firebase console. Go to Firebase Console > Authentication > Sign-in method, click Email/Password, and enable it. (You can also sign in with Continue with Google).';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password. If you have not registered your account yet, please click "Create an Account" below to set your password.';
    case 'auth/user-not-found':
      return 'No registered account found with this email address. Please create an account.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address (e.g., farmer@example.com).';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 8 characters with mixed uppercase, lowercase, numbers or symbols.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was closed before completion. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in request cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'The Google sign-in popup was blocked by your browser. Please allow popups or click Continue with Google again.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. For security, please wait a few moments or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection and retry.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact AeroFlora support.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console for OAuth. Please add it to Authorized Domains in Firebase Authentication Settings.';
    default:
      return (
        message.replace(/^Firebase:\s*/, '').replace(/\s*\([^)]+\)\.?$/, '').trim() ||
        'Authentication failed. Please verify your credentials and try again.'
      );
  }
}

export interface PasswordCriteriaResult {
  minLength: boolean;
  hasUppercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
  passedCount: number;
}

// Real-time evaluation of password complexity criteria
export function checkPasswordCriteria(password: string): PasswordCriteriaResult {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);

  const passedCount = [minLength, hasUppercase, hasDigit, hasSpecialChar].filter(Boolean).length;

  return {
    minLength,
    hasUppercase,
    hasDigit,
    hasSpecialChar,
    isValid: minLength && hasUppercase && hasDigit && hasSpecialChar,
    passedCount,
  };
}

// Validate password requirements: minimum 8 characters, at least one digit, one special character, and one uppercase letter
export function validatePasswordSecurity(password: string): { isValid: boolean; message: string } {
  const criteria = checkPasswordCriteria(password);
  if (!criteria.minLength) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }
  if (!criteria.hasUppercase) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter (A-Z).',
    };
  }
  if (!criteria.hasDigit) {
    return {
      isValid: false,
      message: 'Password must contain at least one digit (0-9).',
    };
  }
  if (!criteria.hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character (!@#$%^&* etc.).',
    };
  }
  return { isValid: true, message: '' };
}

/**
 * Register a new user with Email & Password in Firebase Authentication
 * Automatically sends an email verification link
 */
export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string,
  role: UserRole = 'farmer',
  extraProfile: { organization?: string; mobileNumber?: string; state?: string; district?: string } = {}
): Promise<{ user: AuthUser; fbUser: FirebaseUser }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();

  if (!cleanEmail) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanName) {
    throw new Error('Please enter your full name.');
  }

  // Enforce password requirements
  const passCheck = validatePasswordSecurity(password);
  if (!passCheck.isValid) {
    throw new Error(passCheck.message);
  }

  // 1. Create Firebase Auth user
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const fbUser = credential.user;

  // 2. Update display name asynchronously
  try {
    await updateProfile(fbUser, { displayName: cleanName });
  } catch (err) {
    console.warn('Error updating profile display name:', err);
  }

  // 3. Send email verification link
  try {
    await sendEmailVerification(fbUser);
  } catch (err) {
    console.warn('Error sending initial verification email:', err);
  }

  // 4. Save profile to Firestore under users/{uid} safely
  const initialProfile: Partial<AuthUser> = {
    id: fbUser.uid,
    email: cleanEmail,
    fullName: cleanName,
    role: role,
    organization: extraProfile.organization || (role === 'farmer' ? 'Krishi Farm' : 'AgriTech Partner'),
    mobileNumber: extraProfile.mobileNumber || '',
    state: extraProfile.state || 'Rajasthan',
    district: extraProfile.district || 'Jaipur',
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  await safeFirestoreOperation(async () => {
    const hash = await hashSecurityPassword(password);
    const userDocRef = doc(db, 'users', fbUser.uid);
    await setDoc(userDocRef, { ...initialProfile, securityPasswordHash: hash }, { merge: true });
  }, null);

  const authUser = mapFirebaseUserToAuthUser(fbUser, initialProfile);
  return { user: authUser, fbUser };
}

/**
 * Sign in with Email & Password
 * Real Firebase Authentication signInWithEmailAndPassword
 */
export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<{ user: AuthUser; fbUser: FirebaseUser; emailVerified: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Please enter your email address.');
  }
  if (!password) {
    throw new Error('Please enter your account password.');
  }

  // Configure session persistence
  await setAuthPersistence(rememberMe);

  // Authenticate with Firebase
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const fbUser = credential.user;

  // Load Firestore profile with safe non-blocking timeout
  const profileData = await safeFirestoreOperation<Partial<AuthUser> | null>(async () => {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);
    const hash = await hashSecurityPassword(password);
    if (userDoc.exists()) {
      const data = userDoc.data() as Partial<AuthUser>;
      // Update last login timestamp and security password in background
      updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified,
        securityPasswordHash: hash,
      }).catch((e) => console.warn('Background login stamp notice:', e));
      return data;
    } else {
      await setDoc(userDocRef, { securityPasswordHash: hash }, { merge: true });
    }
    return null;
  }, null);

  const authUser = mapFirebaseUserToAuthUser(fbUser, profileData);
  return {
    user: authUser,
    fbUser,
    emailVerified: fbUser.emailVerified,
  };
}

/**
 * Sign in with official Google OAuth Provider
 * Enforces prompt: 'select_account' for fresh authentication.
 * Sets persistence BEFORE invoking the provider based on Remember Me selection.
 */
export async function loginWithGoogle(
  rememberMe: boolean = false,
  loginHint?: string
): Promise<{ user: AuthUser; fbUser: FirebaseUser }> {
  // 1. Configure session persistence BEFORE starting the sign-in operation
  await setAuthPersistence(rememberMe);

  // 2. Generate a fresh GoogleAuthProvider with prompt: select_account
  const provider = createGoogleProvider(loginHint);

  let fbUser: FirebaseUser;

  try {
    const credential = await signInWithPopup(auth, provider);
    fbUser = credential.user;
  } catch (popupError: any) {
    if (
      popupError?.code === 'auth/popup-blocked' ||
      popupError?.code === 'auth/cancelled-popup-request'
    ) {
      // In constrained iframe environments, attempt redirect fallback
      try {
        await signInWithRedirect(auth, provider);
        // Page redirects, execution terminates here
        return new Promise(() => {});
      } catch (redirectErr) {
        throw popupError;
      }
    }
    throw popupError;
  }

  // Sync profile to Firestore with safe non-blocking timeout
  const profileData = await safeFirestoreOperation<Partial<AuthUser> | null>(async () => {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      const newProfile: Partial<AuthUser> = {
        id: fbUser.uid,
        email: fbUser.email || '',
        fullName: fbUser.displayName || 'Google Verified Farmer',
        role: 'farmer',
        avatarUrl: fbUser.photoURL || '',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
    } else {
      const existingData = existing.data() as Partial<AuthUser>;
      updateDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
        emailVerified: true,
      }).catch((e) => console.warn('Background google stamp notice:', e));
      return existingData;
    }
  }, null);

  const authUser = mapFirebaseUserToAuthUser(fbUser, profileData);
  return { user: authUser, fbUser };
}

/**
 * Check if a redirect result exists from a previous Google sign-in redirect
 */
export async function checkRedirectAuthResult(): Promise<{ user: AuthUser; fbUser: FirebaseUser } | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const fbUser = result.user;
      const profileData = await safeFirestoreOperation<Partial<AuthUser> | null>(async () => {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        return userDoc.exists() ? (userDoc.data() as Partial<AuthUser>) : null;
      }, null);

      return {
        user: mapFirebaseUserToAuthUser(fbUser, profileData),
        fbUser,
      };
    }
  } catch (err) {
    console.warn('Redirect auth check notice:', err);
  }
  return null;
}

/**
 * Send Password Reset Email via Firebase Authentication
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Please enter the email address associated with your account.');
  }
  await sendPasswordResetEmail(auth, cleanEmail);
}

/**
 * Resend Email Verification Link to currently authenticated user
 */
export async function resendVerification(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('No account is currently signed in. Please enter your email and password first.');
  }
  await sendEmailVerification(auth.currentUser);
}

/**
 * Reload the current Firebase user to verify if they have completed email verification
 */
export async function refreshEmailVerification(): Promise<boolean> {
  if (!auth.currentUser) return false;
  await auth.currentUser.reload();
  const verified = auth.currentUser.emailVerified;
  if (verified) {
    safeFirestoreOperation(async () => {
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
        emailVerified: true,
      });
    }, null).catch(() => {});
  }
  return verified;
}

/**
 * Sign out user from Firebase Authentication
 * Clears the authenticated session and resets persistence.
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
  // Revert persistence to browserSessionPersistence to ensure no stale token auto-restores
  try {
    await setAuthPersistence(false);
  } catch (err) {
    console.warn('Logout persistence revert notice:', err);
  }

  // Clear application session storage and unlock keys
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
  }
}

/**
 * Generates SHA-256 hash for strict password validation
 */
export async function hashSecurityPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_aeroflora_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Save user's security password hash in Firestore users/{uid}
 */
export async function saveSecurityPassword(uid: string, password: string): Promise<void> {
  const hash = await hashSecurityPassword(password);
  await safeFirestoreOperation(async () => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { securityPasswordHash: hash }, { merge: true });
  }, null);
}

/**
 * Check if the user has an existing security password configured
 */
export async function checkHasSecurityPassword(uid: string): Promise<boolean> {
  return await safeFirestoreOperation(async () => {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return Boolean(data.securityPasswordHash);
    }
    return false;
  }, false);
}

/**
 * Verify user's entered password against their stored security password hash
 */
export async function verifySecurityPassword(uid: string, enteredPassword: string): Promise<boolean> {
  const enteredHash = await hashSecurityPassword(enteredPassword);
  return await safeFirestoreOperation(async () => {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (!data.securityPasswordHash) {
        // If not set yet, set it now and accept
        await setDoc(userDocRef, { securityPasswordHash: enteredHash }, { merge: true });
        return true;
      }
      return data.securityPasswordHash === enteredHash;
    }
    return false;
  }, false);
}

