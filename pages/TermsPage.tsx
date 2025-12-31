import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ProhibitedIcon } from '../components/icons/ProhibitedIcon';
import { ScrollIcon } from '../components/icons/ScrollIcon';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-bg-alt/50 border border-default/20 flex items-center justify-center">
            <ScrollIcon className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">Terms of Service</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">Last Updated: November 22, 2025</p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <section className="border-l-2 border-default/20 pl-4 sm:pl-6">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">Agreement</h2>
            <p className="text-default/90 leading-relaxed">
              By accessing or using Sancho, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">License & Usage</h2>
            <div className="bg-bg-alt/30 p-5 sm:p-8 border border-default/20 rounded-sm">
              <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
                <div className="group">
                  <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3 flex items-center gap-2 group-hover:text-accent transition-colors">
                    <CheckIcon className="w-5 h-5 text-accent" />
                    <span>Permitted Use</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Browse poetry forms & devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Generate AI examples for education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Learn from classic snippets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Save journal entries and notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Create account for themes</span>
                    </li>
                  </ul>
                </div>
                <div className="group">
                  <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3 flex items-center gap-2 group-hover:text-tag-form-text transition-colors">
                    <ProhibitedIcon className="w-5 h-5 text-tag-form-text" />
                    <span>Prohibited</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-tag-form-text rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Commercial redistribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-tag-form-text rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Reverse engineering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-tag-form-text rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Automated scraping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-tag-form-text rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>Removing copyright notices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Content Licensing</h2>
            <div className="space-y-6">
              <div className="bg-bg-alt/30 p-5 sm:p-6 border border-default/20 rounded-sm">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ScrollIcon className="w-5 h-5 text-accent" />
                  <span>Classic Poetry Snippets</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-3">
                  Poetry examples and brief excerpts featured in Sancho are used strictly for educational purposes under fair use doctrine (17 U.S.C. § 107). Short excerpts are used to demonstrate specific poetic techniques, forms, and literary devices.
                </p>
                <p className="text-xs text-muted/70 italic">
                  Works in the public domain are freely used. If you believe any content infringes your copyright, please contact us through the Replit platform.
                </p>
              </div>

              <div className="border-l-2 border-accent/50 pl-4 sm:pl-6 py-2">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3">AI Content Disclaimer</h3>
                <p className="text-muted mb-4 leading-relaxed text-sm">
                  Sancho uses XAI's Grok model to generate content. Please be aware:
                </p>
                <ul className="space-y-2 text-sm text-muted font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">01.</span>
                    <span>Content is for educational purposes only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">02.</span>
                    <span>Generated examples may vary in historical accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">03.</span>
                    <span>Verification is recommended for academic use</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-bg-alt/50 border border-default/30 p-5 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 sm:mb-6 tracking-tight">Rate Limiting</h2>
            <p className="text-default/90 mb-4">
              To ensure fair usage, the following limits apply:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border border-default/20 bg-bg-alt/20 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-default">Poetry Examples</span>
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">10 req/min</span>
              </div>
              <div className="p-4 border border-default/20 bg-bg-alt/20 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-default">Sancho Quotes</span>
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">5 req/min</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Legal</h2>
            <div className="space-y-4 text-sm text-default/90 leading-relaxed">
              <p>
                <strong className="text-default">Intellectual Property:</strong> The service design, branding, user interface, and original database are owned by Sancho. Poetry excerpts are used under fair use for educational purposes with proper attribution.
              </p>
              <p>
                <strong className="text-default">Disclaimer:</strong> Materials are provided "as is". We disclaim all warranties regarding accuracy, reliability, or fitness for purpose.
              </p>
              <p>
                <strong className="text-default">Liability:</strong> Sancho shall not be liable for any damages arising from use or inability to use the service.
              </p>
            </div>
          </section>

          <div className="text-center pt-8">
            <Link
              to="/"
              className="inline-block px-6 sm:px-8 py-3 border border-default text-default text-sm font-semibold bg-[rgb(var(--app-bg-alt)/0.4)] backdrop-blur-sm hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 uppercase tracking-wider rounded-lg"
            >
              Explore Poetry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
