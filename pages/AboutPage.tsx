import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto mb-6 opacity-90 grayscale hover:grayscale-0 transition-all duration-500">
            <img 
              src="/sancho-logo.png" 
              alt="Sancho Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-3xl font-bold text-default mb-2 tracking-tight">About Sancho</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">Your Faithful Poetic Reference Squire</p>
        </div>

        <div className="space-y-12">
          <section className="border-l-2 border-default/20 pl-6">
            <h2 className="text-xl font-bold text-default mb-4 tracking-tight">What is Sancho?</h2>
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
            <h2 className="text-xl font-bold text-default mb-8 tracking-tight border-b border-default/20 pb-2">Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">📝 37 Poetic Forms</h3>
                <p className="text-muted text-sm leading-relaxed">
                  From sonnets and haikus to villanelles and ghazals, explore diverse poetic structures with detailed conventions and examples.
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">📊 22 Poetic Meters</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Master iambic pentameter, trochaic tetrameter, and other rhythmic patterns that give poetry its musical quality.
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">🎨 31 Literary Devices</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Learn about metaphor, alliteration, enjambment, and other techniques poets use to craft meaning and beauty.
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">🤖 AI-Powered Examples</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Generate fresh poetry examples using XAI's Grok model to see any form, meter, or device in action.
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">🎭 Classic Snippets</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Each entry includes authentic examples from renowned poets throughout literary history.
                </p>
              </div>
              <div className="group">
                <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-2 group-hover:text-accent transition-colors">🎨 Premium Themes</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Unlock beautiful Paper and Slate color schemes by logging in with your Replit account.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-bg-alt/50 border border-default/30 p-8 rounded-sm">
            <h2 className="text-xl font-bold text-default mb-6 tracking-tight">Technology Stack</h2>
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
                  Latest optimization: Multi-model AI strategy reduces page load times by 40-50% while maintaining premium content quality.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8">
            <Link
              to="/"
              className="inline-block px-8 py-3 border border-default text-default text-sm font-semibold hover:bg-accent hover:text-accent-text hover:border-accent transition-all duration-300 uppercase tracking-wider"
            >
              Explore Poetry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
