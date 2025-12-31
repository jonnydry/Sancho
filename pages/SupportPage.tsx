import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type DonationAmount = 5 | 10 | 25 | 'custom';

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const SupportPage: React.FC = () => {
  const [selectedDonation, setSelectedDonation] = useState<DonationAmount>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ type: 'subscription' }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to payment service. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDonation = async () => {
    const amount = selectedDonation === 'custom' 
      ? parseFloat(customAmount) 
      : selectedDonation;
    
    if (!amount || amount < 1) {
      setError('Please enter a valid donation amount (minimum $1).');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ type: 'donation', amount: Math.round(amount * 100) }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to payment service. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-40 h-40 sm:w-56 sm:h-56 mx-auto mb-6">
            <img
              src="/sancho-logo.png"
              alt="Sancho Logo"
              className="w-full h-full object-contain"
              width="224"
              height="224"
              loading="lazy"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-default mb-2 tracking-tight">Support Sancho</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">Help Keep Poetry Education Free</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-8 sm:space-y-12">
          <section className="border-l-2 border-default/20 pl-4 sm:pl-6">
            <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight">Why Support Sancho?</h2>
            <div className="space-y-4 text-default/90 leading-relaxed">
              <p>
                Sancho is a passion project dedicated to making poetry education accessible to everyone. 
                Your support helps cover server costs, API usage for AI-powered features, and continued development 
                of new educational content.
              </p>
              <p>
                Whether you choose a small monthly subscription or a one-time donation, every contribution 
                helps keep Sancho running and improving for poetry lovers everywhere.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <section className="bg-bg-alt/50 border-2 border-accent/50 p-5 sm:p-8 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-text text-xs font-bold px-3 py-1 rounded-bl-sm">
                RECOMMENDED
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight flex items-center gap-2">
                <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Monthly Supporter
              </h2>
              <div className="text-center py-6">
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-1">$1</div>
                <div className="text-sm text-muted">per month</div>
              </div>
              <ul className="space-y-3 text-sm text-muted mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Support ongoing development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Help keep Sancho free for everyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">✓</span>
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-accent text-accent-text font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Subscribe Monthly'}
              </button>
            </section>

            <section className="bg-bg-alt/30 border border-default/20 p-5 sm:p-8 rounded-sm">
              <h2 className="text-lg sm:text-xl font-bold text-default mb-4 tracking-tight flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.5c1.5-2 4-2.5 6-1s2.5 4 1 6l-7 8-7-8c-1.5-2-1-4.5 1-6s4.5-.5 6 1z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                One-Time Donation
              </h2>
              <p className="text-sm text-muted mb-6">
                Prefer a single contribution? Choose an amount that works for you.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {([5, 10, 25] as const).map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedDonation(amount)}
                    className={`py-2 px-3 text-sm font-semibold rounded-sm border transition-colors ${
                      selectedDonation === amount
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-default/30 text-muted hover:border-default/50'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <button
                  onClick={() => setSelectedDonation('custom')}
                  className={`w-full py-2 px-3 text-sm font-semibold rounded-sm border transition-colors mb-2 ${
                    selectedDonation === 'custom'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-default/30 text-muted hover:border-default/50'
                  }`}
                >
                  Custom Amount
                </button>
                {selectedDonation === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-muted">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="flex-1 py-2 px-3 bg-bg border border-default/30 rounded-sm text-default text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleDonation}
                disabled={isProcessing}
                className="w-full py-3 px-4 border border-default text-default font-semibold text-sm uppercase tracking-wider rounded-sm bg-[rgb(var(--app-bg-alt)/0.4)] hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Donate ${selectedDonation === 'custom' ? (customAmount ? `$${customAmount}` : '') : `$${selectedDonation}`}`}
              </button>
            </section>
          </div>

          <section className="bg-bg-alt/20 border border-default/10 p-5 sm:p-6 rounded-sm">
            <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3">Secure Payments</h3>
            <p className="text-xs text-muted leading-relaxed">
              All payments are processed securely through Stripe. Sancho never stores your payment information. 
              You can manage or cancel your subscription at any time through your Stripe customer portal.
            </p>
          </section>

          <div className="text-center pt-8">
            <Link
              to="/"
              className="inline-block px-6 sm:px-8 py-3 border border-default text-default text-sm font-semibold bg-[rgb(var(--app-bg-alt)/0.4)] backdrop-blur-sm hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 uppercase tracking-wider rounded-lg"
            >
              Back to Poetry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
