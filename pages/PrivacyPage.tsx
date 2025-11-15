import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-default py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-default mb-8">Privacy Policy</h1>
        <div className="bg-bg-alt rounded-2xl p-8 border border-default space-y-6 text-default">
          <p className="text-muted text-sm">Last Updated: November 15, 2025</p>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p>
              Sancho ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our poetry education platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <h3 className="text-lg font-semibold mb-2">Authentication Information</h3>
            <p className="mb-3">
              When you log in with Replit Auth, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Email address</li>
              <li>First and last name</li>
              <li>Profile image URL</li>
              <li>Unique user identifier</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-2">Usage Information</h3>
            <p>
              We automatically collect certain information when you use Sancho:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>IP address (for rate limiting)</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Search queries within the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="mb-2">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide and maintain our service</li>
              <li>Authenticate your account and manage sessions</li>
              <li>Grant access to premium themes for logged-in users</li>
              <li>Prevent abuse through rate limiting</li>
              <li>Improve and optimize our platform</li>
              <li>Communicate important updates about the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Storage and Security</h2>
            <p className="mb-2">
              Your data is stored securely using industry-standard practices:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Encrypted database storage (PostgreSQL on Replit)</li>
              <li>Secure session cookies with HTTPS in production</li>
              <li>OAuth authentication through Replit Auth</li>
              <li>API key protection with backend proxy architecture</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="mb-2">Sancho integrates with the following third-party services:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Replit Auth:</strong> For authentication (governed by Replit's privacy policy)</li>
              <li><strong>XAI (X.AI):</strong> For AI-powered poetry examples and quotes</li>
              <li><strong>Google Fonts:</strong> For typography (Source Code Pro font)</li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Cookies and Local Storage</h2>
            <p className="mb-2">We use cookies and local storage for:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Session management (authentication cookies)</li>
              <li>Theme preferences (dark mode, color scheme)</li>
              <li>Quote caching for offline access</li>
            </ul>
            <p className="mt-3">
              You can control cookies through your browser settings, but this may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Update your profile information</li>
              <li>Opt-out of data collection by not creating an account</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please contact us through the Replit platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
            <p>
              Sancho does not knowingly collect information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of Sancho after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please contact us through the Replit platform or open an issue in the project repository.
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
