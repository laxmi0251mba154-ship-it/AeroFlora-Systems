import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, setAuthPersistence } from '../lib/firebase';
import {
  mapFirebaseUserToAuthUser,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  loginWithGoogle as fbLoginWithGoogle,
  checkRedirectAuthResult,
  sendPasswordReset as fbSendPasswordReset,
  resendVerification as fbResendVerification,
  refreshEmailVerification as fbRefreshEmailVerification,
  logoutFirebase as fbLogout,
  verifySecurityPassword,
  saveSecurityPassword,
  checkHasSecurityPassword,
} from '../utils/firebaseAuthService';
import { AuthUser } from '../types/auth';
import { UserRole } from '../types/aeroflora';

interface AuthContextType {
  currentUser: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isEmailVerified: boolean;
  needsEmailVerification: boolean;
  isSessionUnlocked: boolean;
  hasSecurityPassword: boolean;
  unlockSessionWithPassword: (password: string) => Promise<boolean>;
  setSessionPassword: (password: string) => Promise<boolean>;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<{ emailVerified: boolean; user: AuthUser }>;
  register: (fullName: string, email: string, pass: string, role?: UserRole) => Promise<{ user: AuthUser }>;
  signInWithGoogle: (rememberMe?: boolean) => Promise<AuthUser>;
  resetPassword: (email: string) => Promise<void>;
  resendEmail: () => Promise<void>;
  checkVerification: () => Promise<boolean>;
  logout: () => Promise<void>;
  guestPreviewMode: boolean;
  enableGuestPreview: () => void;
  exitGuestPreview: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState<boolean>(false);
  const [guestPreviewMode, setGuestPreviewMode] = useState<boolean>(false);
  const [isSessionUnlocked, setIsSessionUnlocked] = useState<boolean>(false);
  const [hasSecurityPassword, setHasSecurityPassword] = useState<boolean>(true);

  // Subscribe to Firebase Auth state & handle redirect return
  useEffect(() => {
    // 1. Check for any pending redirect result first
    checkRedirectAuthResult().then(async (res) => {
      if (res) {
        setCurrentUser(res.user);
        setFirebaseUser(res.fbUser);
        setNeedsEmailVerification(!res.user.emailVerified);
        const hasPass = await checkHasSecurityPassword(res.user.id);
        setHasSecurityPassword(hasPass);
        const isUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('aeroflora_unlocked_' + res.user.id) === 'true';
        setIsSessionUnlocked(isUnlocked);
      }
    });

    // 2. Listen to real-time auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        let profileData: Partial<AuthUser> & { securityPasswordHash?: string } | null = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            profileData = userDoc.data() as any;
          }
        } catch (err) {
          console.warn('Error reading user profile on state change:', err);
        }

        const mapped = mapFirebaseUserToAuthUser(fbUser, profileData);
        setCurrentUser(mapped);

        // Check if user has configured a security password
        const hasPass = Boolean(profileData?.securityPasswordHash);
        setHasSecurityPassword(hasPass);

        // Check if this user was already unlocked in this browser session
        const isUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('aeroflora_unlocked_' + fbUser.uid) === 'true';
        setIsSessionUnlocked(isUnlocked);

        // Google accounts are verified by definition; email accounts check emailVerified
        const isGoogle = fbUser.providerData.some((p) => p.providerId === 'google.com');
        if (!isGoogle && !fbUser.emailVerified) {
          setNeedsEmailVerification(true);
        } else {
          setNeedsEmailVerification(false);
        }
      } else {
        setCurrentUser(null);
        setNeedsEmailVerification(false);
        setIsSessionUnlocked(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Real Email/Password login.
   * Auto-unlocks session because password was explicitly verified during login.
   */
  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    const res = await fbLoginWithEmail(email, pass, rememberMe);
    setCurrentUser(res.user);
    setFirebaseUser(res.fbUser);
    setNeedsEmailVerification(!res.emailVerified);
    setGuestPreviewMode(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aeroflora_unlocked_' + res.user.id, 'true');
    }
    setIsSessionUnlocked(true);
    setHasSecurityPassword(true);
    return { emailVerified: res.emailVerified, user: res.user };
  };

  /**
   * Real Registration with Email/Password.
   */
  const register = async (fullName: string, email: string, pass: string, role: UserRole = 'farmer') => {
    const res = await fbRegisterWithEmail(fullName, email, pass, role);
    setCurrentUser(res.user);
    setFirebaseUser(res.fbUser);
    setNeedsEmailVerification(true);
    setGuestPreviewMode(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aeroflora_unlocked_' + res.user.id, 'true');
    }
    setIsSessionUnlocked(true);
    setHasSecurityPassword(true);
    return { user: res.user };
  };

  /**
   * Real Google OAuth Sign-in.
   * Checks if user has a security password, requiring password entry before opening dashboard.
   */
  const signInWithGoogle = async (rememberMe: boolean = false) => {
    const res = await fbLoginWithGoogle(rememberMe);
    if (res && res.user) {
      setCurrentUser(res.user);
      setFirebaseUser(res.fbUser);
      setNeedsEmailVerification(false);
      setGuestPreviewMode(false);

      const hasPass = await checkHasSecurityPassword(res.user.id);
      setHasSecurityPassword(hasPass);

      const isAlreadyUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('aeroflora_unlocked_' + res.user.id) === 'true';
      setIsSessionUnlocked(isAlreadyUnlocked);

      return res.user;
    }
    throw new Error('Google authentication was cancelled or returned empty.');
  };

  /**
   * Unlock current session by verifying password
   */
  const unlockSessionWithPassword = async (pass: string): Promise<boolean> => {
    if (!currentUser) return false;
    const isValid = await verifySecurityPassword(currentUser.id, pass);
    if (isValid) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aeroflora_unlocked_' + currentUser.id, 'true');
      }
      setIsSessionUnlocked(true);
      return true;
    }
    return false;
  };

  /**
   * Configure new security password for current user
   */
  const setSessionPassword = async (pass: string): Promise<boolean> => {
    if (!currentUser) return false;
    await saveSecurityPassword(currentUser.id, pass);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aeroflora_unlocked_' + currentUser.id, 'true');
    }
    setHasSecurityPassword(true);
    setIsSessionUnlocked(true);
    return true;
  };

  const resetPassword = async (email: string) => {
    await fbSendPasswordReset(email);
  };

  const resendEmail = async () => {
    await fbResendVerification();
  };

  const checkVerification = async () => {
    const verified = await fbRefreshEmailVerification();
    if (verified) {
      setNeedsEmailVerification(false);
      if (currentUser) {
        setCurrentUser({ ...currentUser, emailVerified: true });
      }
    }
    return verified;
  };

  /**
   * Comprehensive Logout: Clears Firebase Auth, session storage, and lock state.
   * Guarantees next login MUST enter a password.
   */
  const logout = async () => {
    await fbLogout();
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      // Remove any leftover unlock keys
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('aeroflora_unlocked_')) localStorage.removeItem(k);
      });
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    setNeedsEmailVerification(false);
    setIsSessionUnlocked(false);
    setGuestPreviewMode(false);
  };

  const enableGuestPreview = () => {
    setGuestPreviewMode(true);
  };

  const exitGuestPreview = () => {
    setGuestPreviewMode(false);
  };

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    isEmailVerified: Boolean(firebaseUser?.emailVerified),
    needsEmailVerification,
    isSessionUnlocked,
    hasSecurityPassword,
    unlockSessionWithPassword,
    setSessionPassword,
    login,
    register,
    signInWithGoogle,
    resetPassword,
    resendEmail,
    checkVerification,
    logout,
    guestPreviewMode,
    enableGuestPreview,
    exitGuestPreview,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

