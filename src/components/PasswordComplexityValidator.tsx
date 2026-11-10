/**
 * AeroFlora Systems - Real-Time Password Complexity Validator
 * Checks 4 mandatory rules:
 * 1. Minimum 8 characters
 * 2. At least one uppercase letter (A-Z)
 * 3. At least one digit (0-9)
 * 4. At least one special character (!@#$%^&* etc.)
 * Provides dynamic visual feedback with checklist icons and strength gauge.
 */

import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import { checkPasswordCriteria } from '../utils/firebaseAuthService';

interface PasswordComplexityValidatorProps {
  password: string;
  confirmPassword?: string;
  showAlways?: boolean;
}

export const PasswordComplexityValidator: React.FC<PasswordComplexityValidatorProps> = ({
  password,
  confirmPassword,
  showAlways = false,
}) => {
  // If user hasn't typed anything and showAlways is false, keep UI uncluttered
  if (!password && !showAlways) {
    return null;
  }

  const criteria = checkPasswordCriteria(password);
  const passwordsMatch = confirmPassword !== undefined && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword !== undefined && confirmPassword.length > 0 && password !== confirmPassword;

  // Strength label & color
  const getStrengthMeta = () => {
    switch (criteria.passedCount) {
      case 0:
      case 1:
        return { label: 'Too Weak', color: 'bg-rose-500', text: 'text-rose-600', percent: 25 };
      case 2:
        return { label: 'Weak', color: 'bg-amber-500', text: 'text-amber-600', percent: 50 };
      case 3:
        return { label: 'Moderate', color: 'bg-yellow-500', text: 'text-yellow-600', percent: 75 };
      case 4:
        return { label: 'Strong & Secure', color: 'bg-emerald-600', text: 'text-emerald-700', percent: 100 };
      default:
        return { label: 'Too Weak', color: 'bg-slate-300', text: 'text-slate-500', percent: 0 };
    }
  };

  const strength = getStrengthMeta();

  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5 animate-in fade-in duration-200 text-xs">
      {/* Top Strength Bar & Label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
          {criteria.isValid ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>Password Complexity:</span>
          <span className={`font-black ${strength.text}`}>{strength.label}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {criteria.passedCount} of 4 rules met
        </span>
      </div>

      {/* 4-Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              step <= criteria.passedCount ? strength.color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* 4 Real-Time Rule Checklists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
        {/* Rule 1: Minimum 8 Characters */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-colors ${
            criteria.minLength
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          {criteria.minLength ? (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <X className="w-2.5 h-2.5" />
            </div>
          )}
          <span>At least 8 characters</span>
        </div>

        {/* Rule 2: At least one uppercase letter */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-colors ${
            criteria.hasUppercase
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          {criteria.hasUppercase ? (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <X className="w-2.5 h-2.5" />
            </div>
          )}
          <span>One uppercase letter (A-Z)</span>
        </div>

        {/* Rule 3: At least one digit */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-colors ${
            criteria.hasDigit
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          {criteria.hasDigit ? (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <X className="w-2.5 h-2.5" />
            </div>
          )}
          <span>At least one number (0-9)</span>
        </div>

        {/* Rule 4: At least one special character */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-colors ${
            criteria.hasSpecialChar
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-semibold'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          {criteria.hasSpecialChar ? (
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
              <X className="w-2.5 h-2.5" />
            </div>
          )}
          <span>One special symbol (!@#$)</span>
        </div>
      </div>

      {/* Optional Password Match Feedback */}
      {confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div
          className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between ${
            passwordsMatch
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <span>{passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match yet'}</span>
          <span className="font-mono text-[9px]">{passwordsMatch ? 'Ready' : 'Check entry'}</span>
        </div>
      )}
    </div>
  );
};
