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
} from '../utils/firebaseAuthService';
import { AuthUser } from '../types/auth';
import { UserRole } from '../types/aeroflora';

interface AuthContextType {
  currentUser: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isEmailVerified: boolean;
  needsEmailVerification: boolean;
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

  // Subscribe to Firebase Auth state & handle redirect return
  useEffect(() => {
    // 1. Check for any pending redirect result first
    checkRedirectAuthResult().then((res) => {
      if (res) {
        setCurrentUser(res.user);
        setFirebaseUser(res.fbUser);
        setNeedsEmailVerification(!res.user.emailVerified);
      }
    });

    // 2. Listen to real-time auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        // Fetch Firestore profile safely if available
        let profileData: Partial<AuthUser> | null = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            profileData = userDoc.data() as Partial<AuthUser>;
          }
        } catch (err) {
          console.warn('Error reading user profile on state change:', err);
        }

        const mapped = mapFirebaseUserToAuthUser(fbUser, profileData);
        setCurrentUser(mapped);

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
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Real Email/Password login.
   * Notice: We do NOT set global `loading = true` here because that causes
   * App.tsx to display a full-screen loading screen and unmount LoginPage,
   * dropping form inputs and error messages!
   */
  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    const res = await fbLoginWithEmail(email, pass, rememberMe);
    setCurrentUser(res.user);
    setFirebaseUser(res.fbUser);
    setNeedsEmailVerification(!res.emailVerified);
    setGuestPreviewMode(false);
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
    return { user: res.user };
  };

  /**
   * Real Google OAuth Sign-in.
   * Enforces prompt: 'select_account' and sets session or local persistence based on Remember Me.
   */
  const signInWithGoogle = async (rememberMe: boolean = false) => {
    const res = await fbLoginWithGoogle(rememberMe);
    if (res && res.user) {
      setCurrentUser(res.user);
      setFirebaseUser(res.fbUser);
      setNeedsEmailVerification(false);
      setGuestPreviewMode(false);
      return res.user;
    }
    throw new Error('Google authentication was cancelled or returned empty.');
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

  const logout = async () => {
    await fbLogout();
    setCurrentUser(null);
    setFirebaseUser(null);
    setNeedsEmailVerification(false);
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

