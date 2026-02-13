'use client';

import { useState, useEffect } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter_dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem('newsletter_dismissed', 'true');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-600 p-5 relative">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close newsletter popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-2">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">You&apos;re subscribed!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 pr-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Get EU Jobs in Your Inbox
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Weekly digest of the best opportunities in the EU bubble.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-eu-blue focus:border-transparent"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 bg-eu-blue text-white text-sm font-medium rounded-lg hover:bg-eu-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === 'loading' ? 'Sending...' : 'Subscribe'}
              </button>
            </form>

            {status === 'error' && message && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
