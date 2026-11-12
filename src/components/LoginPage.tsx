/**
 * AeroFlora Systems - Next-Generation ClimateTech & AgriTech Authentication
 * Obsidian Navy & Glacier Cyan Precision SaaS Architecture
 * 100% Real Firebase Authentication + Web Crypto SHA-256 Zero-Trust Vault
 */

import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sprout,
  Activity,
  Layers,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/aeroflora';
import { parseAuthErrorMessage, validatePasswordSecurity } from '../utils/firebaseAuthService';
import { PasswordComplexityValidator } from './PasswordComplexityValidator';

interface LoginPageProps {
  initialMode?: 'signin' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'signin',
  onSuccess,
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
    logout,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'verify'>(
    needsEmailVerification ? 'verify' : initialMode
  );

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  // UI Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Sync mode if needs verification
  useEffect(() => {
    if (needsEmailVerification) {
      setMode('verify');
    }
  }, [needsEmailVerification]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Mode Switchers with email/credential carry-over
  const switchToSignUp = () => {
    setMode('signup');
    if (signInEmail) {
      setSignUpEmail(signInEmail.trim());
      if (!signUpName.trim()) {
        const local = signInEmail.split('@')[0] || '';
        const first = local.split('.')[0] || local;
        const formatted = first.charAt(0).toUpperCase() + first.slice(1);
        setSignUpName(formatted);
      }
    }
    if (signInPassword) {
      setSignUpPassword(signInPassword);
      setSignUpConfirmPassword(signInPassword);
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const switchToSignIn = () => {
    setMode('signin');
    if (signUpEmail) {
      setSignInEmail(signUpEmail.trim());
    }
    if (signUpPassword) {
      setSignInPassword(signUpPassword);
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Handle Email & Password Sign In
  const handleSignInSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailToUse = signInEmail.trim();
    if (!emailToUse) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    if (!signInPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(emailToUse, signInPassword, rememberMe);
      if (!result.emailVerified) {
        setMode('verify');
        setSuccessMessage('Sign in successful. Please verify your email to unlock all dashboard telemetry.');
      } else {
        setSuccessMessage(`Welcome back, ${result.user.fullName}!`);
        onSuccess?.();
      }
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Registration
  const handleSignUpSubmit = async (e: React.FormEvent) => {
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
      setSuccessMessage('Account registered! A verification email has been dispatched.');
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In directly
  const handleGoogleSignInClick = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const user = await signInWithGoogle(rememberMe);
      setSuccessMessage(`Signed in as ${user.fullName} via Google. Verifying security credentials...`);
      onSuccess?.();
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

  // Handle Password Reset Request
  const handleResetSubmit = async (e: React.FormEvent) => {
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
      setSuccessMessage(`Password reset link sent to ${resetEmail.trim()}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Verification Resend
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await resendEmail();
      setResendCooldown(60);
      setSuccessMessage('Verification email link resent! Please check your spam folder if not visible.');
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Check if email has been verified
  const handleCheckVerification = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const verified = await checkVerification();
      if (verified) {
        setSuccessMessage('Email verified successfully! Opening your agricultural dashboard...');
        setTimeout(() => {
          onSuccess?.();
        }, 800);
      } else {
        setErrorMessage(
          'Email not yet verified. Please click the link sent to your email address, then click this button again.'
        );
      }
    } catch (err: any) {
      setErrorMessage(parseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Ambient Atmospheric Glow Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Mobile Bar (Visible on small screens) */}
      <header className="lg:hidden bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-sm">
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">AeroFlora Systems</span>
            <span className="block text-[10px] text-slate-400 font-medium">Farm Water Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Secure Sign In</span>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 gap-8 lg:gap-14 items-center justify-center relative z-10">
        {/* ================= LEFT SECTION: BRAND & HIGH-TECH SHOWCASE ================= */}
        <section className="w-full lg:w-1/2 flex flex-col justify-between space-y-6 lg:space-y-8 max-w-xl">
          {/* Brand Header */}
          <div className="hidden lg:flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/20">
              <Droplets className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-extrabold tracking-tight text-white">AeroFlora Systems</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 font-mono">
                  AgriTech · India
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Atmospheric Water Harvesting &amp; Precision Irrigation Intelligence
              </p>
            </div>
          </div>

          {/* Hero Headline & Supporting Statement */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Biomimetic Condensation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>ICAR Agro-Climatic Models</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-sky-400 font-semibold">PM-KUSUM Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Pure Atmospheric Water. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
                Data-Driven Farming.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal pt-1">
              Harness passive solar atmospheric harvesting, monitor irrigation salinity, and access localized FAO-56 crop water scheduling designed for Indian growers.
            </p>
          </div>

          {/* High-Fidelity Agricultural Visual Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
            <img
              src="/src/assets/images/hero_water_intelligence_1794484197707.jpg"
              alt="AeroFlora Atmospheric Water Harvesting Tower at Dawn"
              className="w-full h-56 sm:h-64 object-cover transform transition-transform duration-700 group-hover:scale-102"
              loading="eager"
            />
            {/* Visual Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 mb-1">
                <Activity className="w-4 h-4 text-sky-400" />
                <span>Autonomous Sorbent Tower Field Installation</span>
              </div>
              <p className="text-xs text-slate-300 font-medium max-w-md">
                Continuous 24-hour cycle generating irrigation-grade mineralized water in semi-arid and arid agricultural zones.
              </p>
            </div>
          </div>

          {/* Unboxed Trust Points */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>ICAR Crop Benchmark</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>SAR &amp; Salinity Guard</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Solar Thermal Recovery</span>
            </div>
          </div>
        </section>

        {/* ================= RIGHT SECTION: MODERN AUTHENTICATION CARD ================= */}
        <section className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 transition-all">
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5 flex-1">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <span className="font-medium leading-relaxed block">{errorMessage}</span>
                    {errorMessage.includes('Create an Account') && (
                      <button
                        type="button"
                        onClick={switchToSignUp}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-300 hover:bg-slate-50 shadow-2xs transition cursor-pointer mt-1"
                      >
                        <span>Create account with {signInEmail || 'this email'}</span>
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

            {/* Top Navigation Tabs: Sign In / Create Account */}
            {(mode === 'signin' || mode === 'signup') && (
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ================= MODE 1: SIGN IN ================= */}
            {mode === 'signin' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in to access your farm telemetry, water balances, and crop schedules.
                  </p>
                </div>

                {/* Real Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider with "OR" */}
                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or sign in with password</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                {/* Email and Password Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4" autoComplete="off">
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
                        value={signInEmail}
                        onChange={(e) => {
                          setSignInEmail(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="farmer@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-slate-400"
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
                          setResetEmail(signInEmail);
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => {
                          setSignInPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                        title={showSignInPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4 cursor-pointer accent-slate-900"
                      />
                      <span className="text-xs text-slate-600 font-medium">Remember Me</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">256-bit TLS</span>
                  </div>

                  {/* Primary Sign In Button */}
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

                {/* Create Account Link */}
                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={switchToSignUp}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                </div>
              </div>
            )}

            {/* ================= MODE 2: REGISTRATION ================= */}
            {mode === 'signup' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Register with your email to access the smart agriculture platform.
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5" autoComplete="off">
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
                        placeholder="e.g. Ramesh Patel or Dr. Sharma"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Agricultural Role <span className="text-sky-600">*</span>
                    </label>
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    >
                      <option value="farmer">🌾 Farmer / Land Owner</option>
                      <option value="agronomist">🔬 Agronomist / Soil Scientist</option>
                      <option value="fpo_admin">🏢 FPO Manager / Agricultural Co-op</option>
                      <option value="technician">🔧 Field Technician / Irrigation Specialist</option>
                      <option value="platform_admin">🛡️ Researcher / System Administrator</option>
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
                        Confirm Password <span className="text-sky-600">*</span>
                      </label>
                      <div className="relative">
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
                  </div>

                  {/* Real-Time Password Complexity Feedback */}
                  <PasswordComplexityValidator
                    password={signUpPassword}
                    confirmPassword={signUpConfirmPassword}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Registering Firebase Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account &amp; Verify</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative flex items-center justify-center pt-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative bg-white px-2 text-[10px] uppercase font-bold text-slate-400">or</div>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignInClick}
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Register with Google</span>
                </button>

                <div className="pt-1 text-center text-xs text-slate-500">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={switchToSignIn}
                    className="font-bold text-sky-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ================= MODE 3: EMAIL VERIFICATION GATE ================= */}
            {mode === 'verify' && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                  <Mail className="w-7 h-7 text-amber-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h2>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    We've sent a secure email verification link to:
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200 inline-block font-mono">
                    {firebaseUser?.email || signUpEmail || signInEmail || 'your email address'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    For farm telemetry protection, unverified accounts cannot access dashboard insights. Please click the link in your email to continue.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCheckVerification}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>I've Verified My Email (Refresh Status)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isLoading || resendCooldown > 0}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {resendCooldown > 0 ? `Resend Link in ${resendCooldown}s` : 'Resend Verification Email'}
                    </span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer font-medium text-xs mx-auto"
                  >
                    ← Sign In with Different Account
                  </button>
                </div>
              </div>
            )}

            {/* ================= MODE 4: FORGOT PASSWORD ================= */}
            {mode === 'forgot' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the email associated with your account. We will send you an official Firebase password reset link.
                  </p>
                </div>

                {resetSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Password Reset Link Dispatched</span>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Please check your inbox (and spam folder) for the reset email from Firebase. Follow the instructions to create your new password, then return here to sign in.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setResetSent(false);
                        setErrorMessage(null);
                      }}
                      className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-800 cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Registered Email Address <span className="text-sky-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="farmer@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Sending Reset Link...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Password Reset Email</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('signin');
                          setErrorMessage(null);
                        }}
                        className="text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Professional Security & Trust Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Real Authentication Active</span>
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                SHA-256 · TLS 1.3
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-400 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AeroFlora Systems Private Limited · Atmospheric Water &amp; Agriculture Technology</span>
          <span className="text-[11px] font-mono text-slate-500">
            Protected by Cloud Identity &amp; 256-bit AES Zero-Trust Encryption
          </span>
        </div>
      </footer>
    </div>
  );
};
