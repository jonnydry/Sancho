import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ProhibitedIcon } from '../components/icons/ProhibitedIcon';
import { ScrollIcon } from '../components/icons/ScrollIcon';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 sm:mb-12 border-b border-default/20 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">Terms of Service</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-wider">Last Updated: November 22, 2025</p>
        </div>

        <div className="space-y-8 sm:space-y-12 text-default/90">
          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Agreement</h2>
            <p className="text-muted leading-relaxed">
              By accessing or using Sancho, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <div className="bg-bg-alt/30 p-5 sm:p-8 border border-default/20 rounded-sm">
              <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4 sm:mb-6">License & Usage</h2>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
                <div>
                  <h3 className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    <span>Permitted Use</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Browse poetry forms & devices
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Generate AI examples for education
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Learn from classic snippets
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Create account for themes
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-tag-form-text mb-3 flex items-center gap-2">
                    <ProhibitedIcon className="w-4 h-4" />
                    <span>Prohibited</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Commercial redistribution
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Reverse engineering
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Automated scraping
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-default">•</span> Removing copyright notices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Content Licensing</h2>
            <div className="bg-bg-alt/30 p-5 sm:p-6 border border-default/20 rounded-sm mb-6">
              <h3 className="text-sm font-bold text-default mb-3 flex items-center gap-2">
                <ScrollIcon className="w-4 h-4 text-default" />
                <span>Classic Poetry Snippets</span>
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-3">
                Poetry examples and brief excerpts featured in Sancho are used strictly for educational purposes under fair use doctrine (17 U.S.C. § 107). Short excerpts are used to demonstrate specific poetic techniques, forms, and literary devices. These excerpts are transformative educational tools, not substitutes for the original works.
              </p>
              <p className="text-xs text-muted/70 italic">
                Educational Fair Use: Brief excerpts from copyrighted works are used for nonprofit educational purposes. Attribution is provided through contextual references (author names and work titles appear in examples when known). Works in the public domain are freely used. If you believe any content infringes your copyright, please contact us through the Replit platform.
              </p>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">AI Content Disclaimer</h2>
            <div className="border-l-2 border-accent/50 pl-4 sm:pl-6 py-2">
              <p className="text-muted mb-4 leading-relaxed">
                Sancho uses XAI's Grok model to generate content. Please be aware:
              </p>
              <ul className="space-y-2 text-sm text-muted font-mono">
                <li>1. Content is for educational purposes only</li>
                <li>2. Generated examples may vary in historical accuracy</li>
                <li>3. Verification is recommended for academic use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Rate Limiting</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border border-default/10 bg-bg-alt/20 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-default">Poetry Examples</span>
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">10 req/min</span>
              </div>
              <div className="p-4 border border-default/10 bg-bg-alt/20 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-default">Sancho Quotes</span>
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">5 req/min</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-lg font-bold text-default uppercase tracking-wider mb-4">Legal</h2>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                <strong>Intellectual Property:</strong> The service design, branding, user interface, and original database are owned by Sancho. Poetry excerpts are used under fair use for educational purposes with proper attribution to original authors. Public domain works are freely used.
              </p>
              <p>
                <strong>Disclaimer:</strong> Materials are provided "as is". We disclaim all warranties regarding accuracy, reliability, or fitness for purpose.
              </p>
              <p>
                <strong>Liability:</strong> Sancho shall not be liable for any damages arising from use or inability to use the service.
              </p>
            </div>
          </section>

          <div className="text-center pt-8 sm:pt-12 border-t border-default/10">
            <Link
              to="/"
              className="inline-block px-6 sm:px-8 py-3 border border-white text-white text-sm font-semibold bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/80 transition-all duration-300 uppercase tracking-wider rounded-lg"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
