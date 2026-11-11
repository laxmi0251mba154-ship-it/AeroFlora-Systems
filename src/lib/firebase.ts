/**
 * AeroFlora Systems - Firebase Integration
 * Initializes Firebase Authentication, Firestore, and Google OAuth with local/session persistence.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configurable persistence switcher (Remember Me vs Session)
// Sets persistence explicitly before login operations
export async function setAuthPersistence(remember: boolean) {
  try {
    await setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence
    );
  } catch (err) {
    console.warn('Persistence configuration notice:', err);
  }
}

// Initialize Firestore (using designated database ID from config)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Creates a fresh GoogleAuthProvider with standard account selection
export function createGoogleProvider(loginHint?: string) {
  const provider = new GoogleAuthProvider();
  const customParams: Record<string, string> = {
    prompt: 'select_account',
  };
  if (loginHint) {
    customParams.login_hint = loginHint;
  }
  provider.setCustomParameters(customParams);
  provider.addScope('email');
  provider.addScope('profile');
  return provider;
}

export const googleProvider = createGoogleProvider();

// Test connection on boot as instructed by Firebase integration guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firebase client is offline or network unavailable.');
      return false;
    }
    return true;
  }
}

export default app;
