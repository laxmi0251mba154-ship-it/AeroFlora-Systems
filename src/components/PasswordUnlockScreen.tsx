/**
 * AeroFlora Systems - Password Security Unlock Screen
 * Next-Generation Obsidian Navy & Glacier Cyan Security Styling
 * Enforces mandatory password entry before dashboard access whenever a user logs in.
 */

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';
import { AuthUser } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface PasswordUnlockScreenProps {
  user: AuthUser;
  onUnlock: () => void;
  onCancel: () => void;
}

export const PasswordUnlockScreen: React.FC<PasswordUnlockScreenProps> = ({
  user,
  onUnlock,
  onCancel,
}) => {
  const { unlockSessionWithPassword, setSessionPassword, hasSecurityPassword, resetPassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResetSent, setIsResetSent] = useState(false);

  const isSettingNewPassword = !hasSecurityPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    if (isSettingNewPassword) {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isSettingNewPassword) {
        await setSessionPassword(password);
        setSuccessMessage('Password configured successfully! Unlocking dashboard...');
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        const isValid = await unlockSessionWithPassword(password);
        if (isValid) {
          setSuccessMessage('Password verified! Welcome to your dashboard.');
          setTimeout(() => {
            onUnlock();
          }, 400);
        } else {
          setErrorMessage('Incorrect password. Please enter the valid password for this account.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!user.email) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await resetPassword(user.email);
      setIsResetSent(true);
      setSuccessMessage(`Password reset link sent to ${user.email}. Check your inbox.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans p-4 sm:p-6 selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Ambient Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between py-2 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
            <ShieldCheck className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">AeroFlora Systems</h1>
            <p className="text-[10px] text-slate-400 font-medium">Farm Water Intelligence · Security Gate</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account</span>
        </button>
      </header>

      {/* Main Verification Card */}
      <main className="w-full max-w-md mx-auto my-auto py-6 relative z-10">
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5">
          {/* Lock Icon & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isSettingNewPassword ? 'Set Account Password' : 'Enter Password to Continue'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSettingNewPassword
                  ? 'Create a security password to prevent automatic login and require password verification on every session.'
                  : 'To protect your farm data and telemetry, enter your password to unlock the dashboard.'}
              </p>
            </div>
          </div>

          {/* Account Profile Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full border border-white shadow-xs object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs">
                {(user.fullName || user.email).charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <span className="font-bold text-xs text-slate-900 block truncate">{user.fullName || 'Agricultural User'}</span>
              <span className="text-[11px] text-slate-500 block truncate font-mono">{user.email}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider font-mono">
              Protected
            </span>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {isSettingNewPassword ? 'Create Password' : 'Password'} <span className="text-sky-600">*</span>
                </label>
                {!isSettingNewPassword && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isLoading || isResetSent}
                    className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isResetSent ? 'Reset Link Sent' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={isSettingNewPassword ? 'Enter new password' : 'Enter your password'}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSettingNewPassword && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-sky-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <span>{isSettingNewPassword ? 'Save Password & Enter Dashboard' : 'Unlock Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
            >
              ← Sign in as a different user
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto py-2 text-center text-[11px] text-slate-500 relative z-10">
        <span>Protected by AeroFlora Multi-Factor Security · Strict Session Gate</span>
      </footer>
    </div>
  );
};
