/**
 * AeroFlora Systems - Cloud & Vercel Deployment Guide Modal
 * Directly assists user in deploying to Vercel or cloud platforms
 */

import React, { useState } from 'react';
import {
  CloudUpload,
  CheckCircle2,
  Copy,
  ExternalLink,
  Terminal,
  Github,
  Globe,
  X,
  FileCode,
} from 'lucide-react';

interface DeployVercelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployVercelModal: React.FC<DeployVercelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const vercelJsonConfig = `{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`;

  const cliCommands = `# 1. Install Vercel CLI globally (if not installed)
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy the project to preview
vercel

# 4. Deploy directly to production
vercel --prod`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <CloudUpload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Deploy AeroFlora Systems to Vercel
              </h3>
              <div className="text-xs text-slate-500 font-mono">
                Production-Ready Static SPA Architecture
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Status Note on Assignment Link */}
          <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-950 uppercase">
              <Globe className="w-4 h-4 text-cyan-800" />
              <span>Assignment Link &amp; Vercel Deployment</span>
            </div>
            <p className="text-xs text-cyan-900 leading-relaxed">
              Your assignment brief specifies the submitted working app URL as{' '}
              <strong className="font-mono text-cyan-950">https://aeroflora-systems.ai.studio/</strong>.
              This application has been fully architected with Vite and Tailwind CSS and is 100% compatible with Vercel, Netlify, Cloudflare Pages, or AWS Amplify.
            </p>
          </div>

          {/* Option A: GitHub + Vercel Dashboard (Recommended) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Github className="w-4 h-4" />
              <span>Option 1: Deploy via GitHub &amp; Vercel Dashboard (Recommended)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 font-mono">Step 1:</span>
                <span>Push or sync this codebase to your GitHub repository (e.g. <code>github.com/your-username/aeroflora-systems</code>).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 font-mono">Step 2:</span>
                <span>Log in to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-800 underline">vercel.com</a> and click <strong>&quot;Add New...&quot; &rarr; &quot;Project&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 font-mono">Step 3:</span>
                <span>Import your GitHub repository. Vercel automatically detects the framework as <strong>Vite</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 font-mono">Step 4:</span>
                <div>
                  Confirm build settings (already pre-configured in project):
                  <div className="font-mono text-[11px] bg-white p-2 border border-slate-200 rounded mt-1 space-y-0.5 text-slate-800">
                    <div>• Build Command: <code>npm run build</code></div>
                    <div>• Output Directory: <code>dist</code></div>
                    <div>• Install Command: <code>npm install</code></div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 font-mono">Step 5:</span>
                <span>Click <strong>Deploy</strong>. Your site will be live on a custom <code>.vercel.app</code> domain in ~30 seconds!</span>
              </div>
            </div>
          </div>

          {/* Option B: Vercel CLI (Instant Terminal Deployment) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Terminal className="w-4 h-4" />
                <span>Option 2: Deploy in Seconds with Vercel CLI</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(cliCommands, 'cli')}
                className="flex items-center gap-1 text-xs text-cyan-800 hover:text-cyan-950 font-medium"
              >
                {copiedSection === 'cli' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
              {cliCommands}
            </pre>
          </div>

          {/* Configuration File in Repository */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileCode className="w-4 h-4" />
                <span>Included <code>vercel.json</code> Configuration</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(vercelJsonConfig, 'config')}
                className="flex items-center gap-1 text-xs text-cyan-800 hover:text-cyan-950 font-medium"
              >
                {copiedSection === 'config' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
              {vercelJsonConfig}
            </pre>
            <p className="text-[11px] text-slate-500">
              The <code>vercel.json</code> file has already been generated in your workspace root, guaranteeing clean client-side routing and instant asset resolution.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="text-xs text-slate-500 font-mono">
            Venture: AeroFlora Systems · Ready for Deployment
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
