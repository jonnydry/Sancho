import React from 'react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-default py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-default mb-8">Terms of Service</h1>
        <div className="bg-bg-alt rounded-2xl p-8 border border-default space-y-6 text-default">
          <p className="text-muted text-sm">Last Updated: November 15, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Agreement to Terms</h2>
            <p>
              By accessing or using Sancho, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Use License</h2>
            <p className="mb-2">
              Permission is granted to temporarily access Sancho for personal, non-commercial educational use only. This license grants you the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Browse poetry forms, meters, and literary devices</li>
              <li>Generate AI-powered poetry examples for educational purposes</li>
              <li>Read and learn from classic poetry snippets</li>
              <li>Create an account to access premium themes</li>
            </ul>
            <p className="mb-2">Under this license, you may NOT:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes</li>
              <li>Attempt to decompile or reverse engineer the software</li>
              <li>Remove copyright or proprietary notations</li>
              <li>Transfer the materials to another person or server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">User Accounts</h2>
            <p className="mb-2">
              To access premium features (theme customization), you must create an account using Replit Auth. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">AI-Generated Content</h2>
            <p className="mb-2">
              Sancho uses XAI's Grok model to generate poetry examples and quotes. Please note:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI-generated content is provided for educational purposes only</li>
              <li>Generated examples may not be historically accurate</li>
              <li>You are responsible for verifying information before using it academically</li>
              <li>AI content should be used as a learning aid, not a definitive reference</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Rate Limiting and Fair Use</h2>
            <p className="mb-2">
              To ensure fair access for all users, we implement rate limiting:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Poetry example generation: 10 requests per minute</li>
              <li>Sancho quote generation: 5 requests per minute</li>
            </ul>
            <p className="mt-3">
              Excessive or automated requests may result in temporary or permanent suspension of access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
            <p className="mb-2">
              The service and its original content (excluding public domain poetry examples) are owned by Sancho and are protected by copyright, trademark, and other laws. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Website design and user interface</li>
              <li>Sancho logo and branding</li>
              <li>Compiled poetry reference database</li>
              <li>Application source code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Disclaimer</h2>
            <p className="mb-3">
              The materials on Sancho are provided on an "as is" basis. Sancho makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Accuracy or reliability of materials</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
            </ul>
            <p className="mt-3">
              Classic poetry snippets are used for educational purposes under fair use. If you believe any content infringes your copyright, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitations of Liability</h2>
            <p>
              In no event shall Sancho or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Sancho.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Service Availability</h2>
            <p>
              We strive to maintain continuous service availability but do not guarantee uninterrupted access. Maintenance, updates, or unforeseen technical issues may result in temporary downtime.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue Sancho (or any part thereof) at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
            <p>
              We may revise these Terms of Service at any time without notice. By continuing to use Sancho after changes are posted, you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
            <p>
              Questions about these Terms of Service should be sent to us through the Replit platform.
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-accent hover:bg-accent-hover text-accent-text font-semibold rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
