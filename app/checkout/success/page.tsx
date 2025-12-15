'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, ArrowRight, Loader2, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Xtra Odinary Research"
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Thank you for your purchase. Your scoring credits have been added to your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scoring/new"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30"
            >
              Start Scoring
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>

          {sessionId && (
            <p className="mt-8 text-xs text-gray-400">
              Transaction ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
