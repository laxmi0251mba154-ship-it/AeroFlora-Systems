/**
 * AeroFlora Systems - Real Firebase Authentication Modal
 * Integrates real Firebase email/password, real Google OAuth, email verification gating,
 * and secure password resets in a modal dialog.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  KeyRound,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AuthUser } from '../types/auth';
import { UserRole } from '../types/aeroflora';
import { useAuth } from '../context/AuthContext';
import { parseAuthErrorMessage, validatePasswordSecurity } from '../utils/firebaseAuthService';
import { PasswordComplexityValidator } from './PasswordComplexityValidator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
  isMandatoryGate?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
  isMandatoryGate = false,
}) => {
  const {
    currentUser,
    firebaseUser,
    needsEmailVerification,
    login,
    register,
    signInWithGoogle,
    resetPassword,
    resendEmail,
    checkVerification,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verify'>(
    needsEmailVerification ? 'verify' : initialMode
  );

  // Sign In State (Starts completely empty)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpRole, setSignUpRole] = useState<UserRole>('farmer');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset fields when opened
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      setResetEmail('');
      setResetSent(false);
      setErrorMessage(null);
      setSuccessMessage(null);
      setMode(needsEmailVerification ? 'verify' : initialMode);
    }
  }, [isOpen, initialMode, needsEmailVerification]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle Real Email/Password Login
  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(cleanEmail, password, rememberMe);
      if (!result.emailVerified) {
        setMode('verify');
        setSuccessMessage('Please verify your email address to unlock all farm tools.');
      } else {
        setSuccessMessage(`Welcome back, ${result.user.fullName}!`);
        setTimeout(() => {
          onLoginSuccess(result.user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Official Google Sign-In
  const handleGoogleSignIn = async () => {
    // If credentials were typed in, route to password sign-in directly
    if (email.trim() && password) {
      await handleSignIn();
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const user = await signInWithGoogle(rememberMe);
      if (user) {
        setSuccessMessage(`Signed in as ${user.fullName} via Google.`);
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Real Registration
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const passCheck = validatePasswordSecurity(signUpPassword);
    if (!passCheck.isValid) {
      setErrorMessage(passCheck.message);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      await register(signUpName.trim(), signUpEmail.trim(), signUpPassword, signUpRole);
      setMode('verify');
      setSuccessMessage('Account registered! A verification link has been sent to your email.');
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      setResetSent(true);
      setSuccessMessage('Password reset link sent! Check your inbox.');
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Email
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await resendEmail();
      setSuccessMessage('Fresh verification email sent.');
      setResendCooldown(60);
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Check Email Verification Status
  const handleCheckVerification = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const verified = await checkVerification();
      if (verified) {
        setSuccessMessage('Email verified successfully!');
        setTimeout(() => {
          if (currentUser) onLoginSuccess(currentUser);
          onClose();
        }, 600);
      } else {
        setErrorMessage('Email not yet verified. Please click the link in your email and click this button again.');
      }
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AeroFlora Systems</h3>
                <span className="text-[10px] font-semibold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30 font-mono">
                  Firebase TLS
                </span>
              </div>
              <p className="text-xs text-slate-400">Farm Water Intelligence · Identity Vault</p>
            </div>
          </div>

          {!isMandatoryGate && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850 transition-colors cursor-pointer"
              aria-label="Close"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        {mode !== 'verify' && (
          <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                if (email) {
                  setSignUpEmail(email.trim());
                  if (!signUpName.trim()) {
                    const local = email.split('@')[0] || '';
                    const first = local.split('.')[0] || local;
                    setSignUpName(first.charAt(0).toUpperCase() + first.slice(1));
                  }
                }
                if (password) {
                  setSignUpPassword(password);
                  setSignUpConfirmPassword(password);
                }
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                if (email) setResetEmail(email.trim());
                setErrorMessage(null);
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'forgot'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-2.5 animate-in fade-in">
              <div className="flex items-start gap-2.5 flex-1">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <span className="font-medium leading-relaxed block">{errorMessage}</span>
                  {errorMessage.includes('Create an Account') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        if (email) {
                          setSignUpEmail(email.trim());
                          if (!signUpName.trim()) {
                            const local = email.split('@')[0] || '';
                            const first = local.split('.')[0] || local;
                            setSignUpName(first.charAt(0).toUpperCase() + first.slice(1));
                          }
                        }
                        if (password) {
                          setSignUpPassword(password);
                          setSignUpConfirmPassword(password);
                        }
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-300 hover:bg-sky-100 shadow-2xs transition cursor-pointer mt-1"
                    >
                      <span>Create account with {email || 'this email'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-700 p-0.5 rounded cursor-pointer"
                title="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* ================= SIGN IN MODE ================= */}
          {mode === 'signin' && (
            <div className="space-y-4">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              <p className="text-[11px] text-slate-500 text-center -mt-1 font-mono">
                Google SSO uses your Google Account security settings
              </p>

              <div className="flex items-center gap-3">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">OR SIGN IN WITH PASSWORD</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3.5" autoComplete="off">
                <div className="bg-sky-50/70 border border-sky-200 rounded-lg px-3 py-2 text-[11px] text-sky-900 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                  <span>Sign in with your email &amp; password without any phone notification prompt.</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address <span className="text-sky-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="farmer@example.com"
                      autoComplete="off"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password <span className="text-sky-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setResetEmail(email);
                      }}
                      className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Enter account password"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4 cursor-pointer accent-sky-600"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember credentials</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Firebase Auth</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= SIGN UP MODE ================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-sky-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-sky-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role <span className="text-sky-600">*</span>
                </label>
                <select
                  value={signUpRole}
                  onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="farmer">🌾 Farmer / Land Owner</option>
                  <option value="agronomist">🔬 Agronomist / Soil Scientist</option>
                  <option value="fpo_admin">🏢 FPO Manager / Co-op</option>
                  <option value="technician">🔧 Field Technician</option>
                  <option value="platform_admin">🛡️ Researcher / System Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password <span className="text-sky-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      title={showSignUpPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Real-Time Password Complexity Feedback */}
              <PasswordComplexityValidator
                password={signUpPassword}
                confirmPassword={signUpConfirmPassword}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account &amp; Send Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= VERIFICATION GATE ================= */}
          {mode === 'verify' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Verify Your Email</h4>
                <p className="text-xs text-slate-600 mt-1">
                  A verification link was sent to:{' '}
                  <strong className="text-sky-700">
                    {firebaseUser?.email || signUpEmail || email}
                  </strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Please click the link in your email to verify your account, then refresh your status below.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  <span>I've Verified My Email (Refresh Status)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || resendCooldown > 0}
                  className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{resendCooldown > 0 ? `Resend Link in ${resendCooldown}s` : 'Resend Verification Email'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= FORGOT PASSWORD ================= */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">Reset Password</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your registered email to receive an official password reset link.
                </p>
              </div>

              {resetSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <p className="text-emerald-800 font-semibold">Reset email sent!</p>
                  <p className="text-emerald-700">Check your inbox for instructions to reset your password.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setResetSent(false);
                    }}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-sky-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Reset Email</span>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
