import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from '../components/icons/LockIcon';
import { CookieIcon } from '../components/icons/CookieIcon';
import { KeyIcon } from '../components/icons/KeyIcon';
import { ShieldIcon } from '../components/icons/ShieldIcon';

import { HomeIcon } from '../components/icons/HomeIcon';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 sm:mb-12 border-b border-default/20 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-wider">Last Updated: November 22, 2025</p>
        </div>

        <div className="space-y-8 sm:space-y-12 text-default/90">
          <section>
            <h2 className="text-lg font-bold text-default uppercase tracking-wider mb-4">Introduction</h2>
            <p className="text-muted leading-relaxed">
              Sancho ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our poetry education platform.
            </p>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Information We Collect</h2>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              <div className="bg-bg-alt/30 p-4 sm:p-6 border border-default/20 rounded-sm">
                <h3 className="font-bold text-default mb-3 text-sm">Authentication Data</h3>
                <p className="text-muted text-sm mb-3">When you log in with Replit Auth, we collect:</p>
                <ul className="space-y-1 text-sm text-muted font-mono">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Email address</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>First and last name</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Profile image URL</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Unique identifier</li>
                </ul>
              </div>

              <div className="bg-bg-alt/30 p-4 sm:p-6 border border-default/20 rounded-sm">
                <h3 className="font-bold text-default mb-3 text-sm">Usage Data</h3>
                <p className="text-muted text-sm mb-3">Automatically collected during use:</p>
                <ul className="space-y-1 text-sm text-muted font-mono">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>IP address (rate limiting)</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Browser type & version</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Pages visited</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-accent rounded-full"></span>Search queries</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Data Usage & Security</h2>
            <div className="space-y-4">
              <p className="text-muted leading-relaxed">
                We use collected information to provide services, manage sessions, grant premium access, and optimize the platform. Your data is protected through:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted">
                <li className="flex items-center gap-2 p-2 border border-default/10 bg-bg-alt/20 rounded-sm">
                  <LockIcon className="w-4 h-4 text-accent" />
                  <span>PostgreSQL Database Storage</span>
                </li>
                <li className="flex items-center gap-2 p-2 border border-default/10 bg-bg-alt/20 rounded-sm">
                  <CookieIcon className="w-4 h-4 text-accent" />
                  <span>Session Management</span>
                </li>
                <li className="flex items-center gap-2 p-2 border border-default/10 bg-bg-alt/20 rounded-sm">
                  <KeyIcon className="w-4 h-4 text-accent" />
                  <span>Replit Auth (OpenID Connect)</span>
                </li>
                <li className="flex items-center gap-2 p-2 border border-default/10 bg-bg-alt/20 rounded-sm">
                  <ShieldIcon className="w-4 h-4 text-accent" />
                  <span>Secure Backend Proxy</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="border-l-2 border-accent/30 pl-4 sm:pl-6">
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Your Rights</h2>
            <p className="text-muted mb-4 leading-relaxed">
              You have the right to access your personal data, request account deletion, and update profile information. To exercise these rights, please contact us through the Replit platform.
            </p>
            <p className="text-xs text-muted/70 italic">
              Note: Sancho does not knowingly collect information from children under 13.
            </p>
          </section>

          <div className="text-center pt-8 sm:pt-12 border-t border-default/10">
            <Link
              to="/"
              className="inline-block px-6 sm:px-8 py-3 border border-white text-white text-sm font-semibold bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/80 transition-all duration-300 uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
