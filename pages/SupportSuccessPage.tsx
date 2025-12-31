import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export const SupportSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sessionInfo, setSessionInfo] = useState<{ type: string; amount?: number } | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetch(`/api/stripe/session/${sessionId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.type) {
            setSessionInfo(data);
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-default mb-4 tracking-tight">
          Thank You for Your Support!
        </h1>
        
        <p className="text-default/90 leading-relaxed mb-8">
          {sessionInfo?.type === 'subscription' 
            ? "Your monthly subscription has been set up successfully. You're now helping keep Sancho free and accessible for poetry lovers everywhere."
            : sessionInfo?.type === 'donation'
            ? `Your donation of $${((sessionInfo?.amount || 0) / 100).toFixed(2)} has been received. Your generosity helps us continue improving Sancho.`
            : "Your payment has been processed successfully. Thank you for supporting Sancho!"
          }
        </p>

        <div className="bg-bg-alt/30 border border-default/20 p-5 sm:p-6 rounded-sm mb-8">
          <h3 className="text-sm font-bold text-default uppercase tracking-wider mb-3">What's Next?</h3>
          <p className="text-sm text-muted">
            A confirmation email will be sent to you shortly. You can manage your subscription 
            or view payment history through the Stripe customer portal link in your email.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-6 sm:px-8 py-3 bg-accent text-accent-text text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-accent-hover transition-colors"
          >
            Explore Poetry
          </Link>
          <Link
            to="/about"
            className="inline-block px-6 sm:px-8 py-3 border border-default text-default text-sm font-semibold bg-[rgb(var(--app-bg-alt)/0.4)] hover:bg-[rgb(var(--app-bg-alt)/0.6)] hover:border-accent transition-all duration-300 uppercase tracking-wider rounded-lg"
          >
            About Sancho
          </Link>
        </div>
      </div>
    </div>
  );
};
