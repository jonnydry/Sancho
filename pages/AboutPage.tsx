import React from 'react';
import { Link } from 'react-router-dom';
import { PoeticFormsIcon } from '../components/icons/PoeticFormsIcon';
import { PoeticMetersIcon } from '../components/icons/PoeticMetersIcon';
import { LiteraryDevicesIcon } from '../components/icons/LiteraryDevicesIcon';
import { AiExamplesIcon } from '../components/icons/AiExamplesIcon';
import { ClassicSnippetsIcon } from '../components/icons/ClassicSnippetsIcon';
import { PremiumThemesIcon } from '../components/icons/PremiumThemesIcon';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-6 opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
            <img
              src="/sancho-logo.png"
              alt="Sancho Logo"
              className="w-full h-full object-contain"
              width="288"
              height="288"
              loading="lazy"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">About Sancho</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">Your Faithful Poetic Reference Squire</p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <section className="border-l-2 border-default/20 pl-4 sm:pl-6">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">What is Sancho?</h2>
            <div className="space-y-4 text-default/90 leading-relaxed">
              <p>
                Sancho is a comprehensive poetry education platform named after Sancho Panza, the faithful squire from Miguel de Cervantes' "Don Quixote". Just as Sancho loyally served Don Quixote on his adventures, this application serves as your faithful companion on your journey through the world of poetry.
              </p>
              <p>
                Whether you're a student, teacher, writer, or poetry enthusiast, Sancho provides instant access to essential poetic knowledge with AI-powered examples and classic snippets.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Features</h2>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PoeticFormsIcon className="w-5 h-5" />
                  <span>37 Poetic Forms</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  From sonnets and haikus to villanelles and ghazals, explore diverse poetic structures with detailed conventions and examples.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PoeticMetersIcon className="w-5 h-5" />
                  <span>22 Poetic Meters</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Master iambic pentameter, trochaic tetrameter, and other rhythmic patterns that give poetry its musical quality.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <LiteraryDevicesIcon className="w-5 h-5" />
                  <span>31 Literary Devices</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Learn about metaphor, alliteration, enjambment, and other techniques poets use to craft meaning and beauty.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <AiExamplesIcon className="w-5 h-5" />
                  <span>AI-Powered Examples</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Generate fresh poetry examples using XAI's Grok model to see any form, meter, or device in action. For deeper insights into Grok and xAI concepts, check out{' '}
                  <a
                    href="https://grokipedia.com/grok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:no-underline"
                  >
                    Grokipedia
                  </a>.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <ClassicSnippetsIcon className="w-5 h-5" />
                  <span>Classic Snippets</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Each entry includes authentic examples from renowned poets throughout literary history.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PremiumThemesIcon className="w-5 h-5" />
                  <span>Premium Themes</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Unlock beautiful Paper and Slate color schemes by logging in with your Replit account.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-bg-alt/50 border border-default/30 p-5 sm:p-8 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 sm:mb-6 tracking-tight">Technology Stack</h2>
            <div className="space-y-4">
              <p className="text-default/90 mb-4">
                Sancho is built with modern web technologies and hosted on Replit:
              </p>
              <ul className="space-y-3 text-sm text-muted font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-accent">01.</span>
                  <span>Frontend: React 19 with TypeScript, Tailwind CSS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">02.</span>
                  <span>Backend: Express.js with secure API architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">03.</span>
                  <span>AI: XAI's Grok API with multi-model optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">04.</span>
                  <span>Authentication: Replit Auth with PostgreSQL session storage</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-default/10">
                <p className="text-xs text-muted italic">
                  Latest optimization: Multi-model AI strategy reduces page load times by 40-50% while maintaining premium content quality through intelligent model selection.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-bg-alt/30 border border-default/20 p-5 sm:p-6 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">Content & Licensing</h2>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <p>
                <strong className="text-default">Poetry Excerpts:</strong> Brief excerpts from poetry are used for educational purposes under fair use doctrine (17 U.S.C. § 107). Excerpts are used to demonstrate poetic forms, meters, and literary devices. Attribution is provided through contextual references (author names and work titles in examples). Works in the public domain are freely used.
              </p>
              <p>
                <strong className="text-default">AI-Generated Content:</strong> Poetry examples generated by XAI's Grok models are created specifically for educational demonstration and are unique to each request. These examples illustrate poetic techniques and are not excerpts from existing works.
              </p>
              <p>
                <strong className="text-default">Application:</strong> The Sancho application, including its user interface design, branding, database structure, and original educational content, is the intellectual property of its creators.
              </p>
              <p className="text-xs text-muted/70 pt-2 border-t border-default/10">
                Educational use only. For copyright concerns or questions about attribution, please contact through the Replit platform.
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
