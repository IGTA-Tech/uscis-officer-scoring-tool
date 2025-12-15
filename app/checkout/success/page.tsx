'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const [isDark, setIsDark] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const theme = localStorage.getItem('xtraordinary-theme');
    setIsDark(theme !== 'light');
  }, []);

  return (
    <main className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="text-center px-4">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Payment Successful!
        </h1>

        <p className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          Thank you for your purchase. Your scoring credits have been added to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/scoring/new"
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Start Scoring
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/"
            className={`inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-lg transition-colors border-2 ${
              isDark
                ? 'border-slate-600 text-white hover:bg-slate-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {sessionId && (
          <p className={`mt-8 text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
            Transaction ID: {sessionId.substring(0, 20)}...
          </p>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
