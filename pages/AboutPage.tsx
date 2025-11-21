import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-default py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6">
            <img 
              src="/sancho-logo.png" 
              alt="Sancho Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-default mb-3 sm:mb-4">About Sancho</h1>
          <p className="text-lg sm:text-xl text-muted">Your Faithful Poetic Reference Squire</p>
        </div>

        <div className="bg-bg-alt rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 border border-default">
          <h2 className="text-2xl font-bold text-default mb-4">What is Sancho?</h2>
          <p className="text-default mb-4">
            Sancho is a comprehensive poetry education platform named after Sancho Panza, the faithful squire from Miguel de Cervantes' "Don Quixote". Just as Sancho loyally served Don Quixote on his adventures, this application serves as your faithful companion on your journey through the world of poetry.
          </p>
          <p className="text-default">
            Whether you're a student, teacher, writer, or poetry enthusiast, Sancho provides instant access to essential poetic knowledge with AI-powered examples and classic snippets.
          </p>
        </div>

        <div className="bg-bg-alt rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 border border-default">
          <h2 className="text-xl sm:text-2xl font-bold text-default mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">📝 37 Poetic Forms</h3>
              <p className="text-muted text-sm">
                From sonnets and haikus to villanelles and ghazals, explore diverse poetic structures with detailed conventions and examples.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">📊 22 Poetic Meters</h3>
              <p className="text-muted text-sm">
                Master iambic pentameter, trochaic tetrameter, and other rhythmic patterns that give poetry its musical quality.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">🎨 31 Literary Devices</h3>
              <p className="text-muted text-sm">
                Learn about metaphor, alliteration, enjambment, and other techniques poets use to craft meaning and beauty.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">🤖 AI-Powered Examples</h3>
              <p className="text-muted text-sm">
                Generate fresh poetry examples using XAI's Grok model to see any form, meter, or device in action.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">🎭 Classic Snippets</h3>
              <p className="text-muted text-sm">
                Each entry includes authentic examples from renowned poets throughout literary history.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default mb-2">🎨 Premium Themes</h3>
              <p className="text-muted text-sm">
                Unlock beautiful Paper and Slate color schemes by logging in with your Replit account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-alt rounded-2xl p-5 sm:p-8 border border-default">
          <h2 className="text-xl sm:text-2xl font-bold text-default mb-4">Technology</h2>
          <p className="text-default mb-4">
            Sancho is built with modern web technologies and hosted on Replit:
          </p>
          <ul className="list-disc list-inside space-y-2 text-default mb-6">
            <li><strong>Frontend:</strong> React 19 with TypeScript, Tailwind CSS, and glassomorphic design</li>
            <li><strong>Backend:</strong> Express.js with secure API architecture and rate limiting</li>
            <li><strong>AI:</strong> XAI's Grok API with multi-model optimization (Grok 3-mini for quotes, Grok 4 for examples)</li>
            <li><strong>Authentication:</strong> Replit Auth with PostgreSQL session storage</li>
            <li><strong>Deployment:</strong> Replit Autoscale for seamless scaling (Last deployed: November 21, 2025)</li>
          </ul>
          <p className="text-sm text-muted italic">
            Latest optimization: Multi-model AI strategy reduces page load times by 40-50% while maintaining premium content quality through intelligent model selection.
          </p>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-accent-text font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Explore Poetry
          </Link>
        </div>
      </div>
    </div>
  );
};
