import React from 'react';
import { Link } from 'react-router-dom';
import { PoeticFormsIcon } from '../components/icons/PoeticFormsIcon';
import { PoeticMetersIcon } from '../components/icons/PoeticMetersIcon';
import { LiteraryDevicesIcon } from '../components/icons/LiteraryDevicesIcon';
import { ClassicSnippetsIcon } from '../components/icons/ClassicSnippetsIcon';
import { PremiumThemesIcon } from '../components/icons/PremiumThemesIcon';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-56 h-56 sm:w-72 sm:h-72 mx-auto mb-6">
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
          <section className="bg-accent/5 border border-accent/20 p-5 sm:p-6 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">Our Mission</h2>
            <div className="space-y-4 text-default/90 leading-relaxed">
              <p>
                At Sancho, we believe in giving people beautiful and functional interfaces to advance their learning and love of poetry, writing, and literature. Your data is yours alone, and we will always actively update our privacy and encryption standards to serve the user.
              </p>
              <p>
                Sancho is an independent and open source effort created out of love and hope for future generations to write their own poems of any kind. Conventions are useful, but the best poets break them.
              </p>
              <p>
                We're excited to see what could be possible with Sancho, a tool we wish we had as young writers. If you would like to partner with us in your educational institution, please visit our <Link to="/support" className="text-accent hover:underline underline-offset-2">support page</Link>.
              </p>
            </div>
          </section>

          <section className="border-l-2 border-default/20 pl-4 sm:pl-6">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">What is Sancho?</h2>
            <div className="space-y-4 text-default/90 leading-relaxed">
              <p>
                Sancho is a comprehensive poetry education platform named after Sancho Panza, the faithful squire from Miguel de Cervantes' "Don Quixote". Just as Sancho loyally served Don Quixote on his adventures, this application serves as your faithful companion on your journey through the world of poetry.
              </p>
              <p>
                Whether you're a student, teacher, writer, or poetry enthusiast, Sancho provides instant access to essential poetic knowledge with classic snippets, AI-powered historical context, and a personal journal to capture your creative thoughts.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Reference Library</h2>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PoeticFormsIcon className="w-5 h-5" />
                  <span>69 Poetic Forms</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  From sonnets and haikus to villanelles and ghazals, explore diverse poetic structures with detailed conventions and examples.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PoeticMetersIcon className="w-5 h-5" />
                  <span>37 Poetic Meters</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Master iambic pentameter, trochaic tetrameter, and other rhythmic patterns that give poetry its musical quality.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <LiteraryDevicesIcon className="w-5 h-5" />
                  <span>76 Literary Devices</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Learn about metaphor, alliteration, enjambment, and other techniques poets use to craft meaning and beauty.
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
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Interactive Features</h2>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6.5c1.5-2 4-2.5 6-1s2.5 4 1 6l-7 8-7-8c-1.5-2-1-4.5 1-6s4.5-.5 6 1z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Historical Context</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Select any reference item to explore its origins and evolution with AI-generated historical insights.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 9h16M9 4v16" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Detail Panel</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Select a reference item to open a resizable bottom panel with historical context, related topics, and external links.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 7h10M7 12h10M7 17h6" strokeLinecap="round"/>
                  </svg>
                  <span>Smart Tagging</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Clickable tags connect related concepts. Select a tag to instantly filter the reference library by that topic.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 12h8M12 8v8" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span>Sancho Quotes</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  AI-generated quotes from Sancho Panza himself add a touch of literary humor throughout the experience.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-bg-alt/30 border border-default/20 p-5 sm:p-6 rounded-sm">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">Personal Journal</h2>
            <div className="space-y-4 text-default/90 leading-relaxed">
              <p>
                Capture your creative thoughts with a built-in markdown journal. Write poetry, notes, or reflections with real-time preview and organize entries with custom tags.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">&#8226;</span>
                  <span><strong className="text-default">Account Sync:</strong> Log in to save entries to your account and access them across sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">&#8226;</span>
                  <span><strong className="text-default">Local Mode:</strong> Use the journal without logging in (entries stored in browser only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">&#8226;</span>
                  <span><strong className="text-default">Tag System:</strong> Organize entries with space or comma-separated tags for easy filtering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">&#8226;</span>
                  <span><strong className="text-default">Markdown Support:</strong> Format your writing with headers, lists, emphasis, and more</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-bold text-default mb-6 sm:mb-8 tracking-tight border-b border-default/20 pb-2">Account Features</h2>
            <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <PremiumThemesIcon className="w-5 h-5" />
                  <span>Premium Themes</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Unlock beautiful Paper and Slate color schemes by logging in with your Replit account.
                </p>
              </div>
              <div className="group">
                <h3 className="flex items-center gap-2 text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Saved Items</span>
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Pin your favorite forms, meters, and devices for quick access from your personal collection.
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
                  <span>Frontend: React 19 + TypeScript, Tailwind CSS v4</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">02.</span>
                  <span>Backend: Express.js with full TypeScript coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">03.</span>
                  <span>Database: PostgreSQL with Drizzle ORM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">04.</span>
                  <span>AI: XAI Grok API for historical context and quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">05.</span>
                  <span>Auth: Replit OpenID Connect with session storage</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-default/10">
                <p className="text-xs text-muted italic">
                  Performance optimized with lazy loading, cache-first strategies, and error boundaries for a smooth, resilient experience.
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
                <strong className="text-default">AI-Generated Content:</strong> Historical context and Sancho Panza quotes are generated by XAI's Grok models specifically for educational purposes. This content provides background information and is unique to each request.
              </p>
              <p>
                <strong className="text-default">Don Quixote References:</strong> Quotes from Sancho Panza are inspired by Miguel de Cervantes' <em>Don Quixote</em> (1605, 1615). Our AI-generated quotes aim to capture the spirit of Edith Grossman's celebrated 2003 English translation, published by Ecco/HarperCollins, known for its clarity, wit, and faithfulness to Cervantes' humor.
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
