'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Crown, ArrowLeft, Loader2 } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
  scorings: number;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Single Scoring',
    price: '$49',
    priceId: 'single',
    description: 'Perfect for one-time evaluation',
    scorings: 1,
    features: [
      '1 petition scoring',
      'Full officer report',
      'Chat with AI officer',
      'RFE predictions',
      'PDF report export',
    ],
  },
  {
    name: '5-Pack',
    price: '$199',
    priceId: 'pack5',
    description: 'Best for small firms',
    scorings: 5,
    popular: true,
    features: [
      '5 petition scorings',
      'Save $46 vs single',
      'All single features',
      'Email results',
      'Priority support',
    ],
  },
  {
    name: '10-Pack',
    price: '$349',
    priceId: 'pack10',
    description: 'Best value for volume',
    scorings: 10,
    features: [
      '10 petition scorings',
      'Save $141 vs single',
      'All 5-pack features',
      'Batch scoring',
      'RFE comparison tool',
    ],
  },
  {
    name: 'Unlimited',
    price: '$499/mo',
    priceId: 'unlimited',
    description: 'For high-volume practices',
    scorings: -1,
    features: [
      'Unlimited scorings',
      'All features included',
      'Batch scoring',
      'API access',
      'Dedicated support',
    ],
  },
];

export default function PricingPage() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const theme = localStorage.getItem('xtraordinary-theme');
    setIsDark(theme !== 'light');
  }, []);

  const handlePurchase = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Xtraordinary
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Back Link */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 mb-8 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Start with a free evaluation. Upgrade when you need more.
          </p>
        </div>

        {/* Free Tier */}
        <div className={`max-w-md mx-auto mb-12 p-6 rounded-xl border-2 border-dashed ${isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-400 bg-green-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-green-500" />
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Free Trial</h3>
              <p className={isDark ? 'text-green-400' : 'text-green-700'}>No credit card required</p>
            </div>
          </div>
          <p className={`mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Get your first petition scored completely free. See the full officer report, RFE predictions, and recommendations.
          </p>
          <Link
            href="/scoring/new"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4" />
            Try Free Now
          </Link>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.priceId}
              className={`relative p-6 rounded-xl border ${
                tier.popular
                  ? isDark
                    ? 'border-amber-500 bg-slate-800'
                    : 'border-amber-500 bg-white shadow-lg'
                  : isDark
                    ? 'border-slate-700 bg-slate-800/50'
                    : 'border-gray-200 bg-white'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <div className="mb-2">
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </span>
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {tier.description}
              </p>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier.priceId)}
                disabled={loading === tier.priceId}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                    : isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } disabled:opacity-50`}
              >
                {loading === tier.priceId ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What counts as one scoring?',
                a: 'One scoring = one petition evaluation. This includes the full officer report, RFE predictions, recommendations, and unlimited chat follow-ups for that petition.',
              },
              {
                q: 'Do credits expire?',
                a: 'No! Purchased credits never expire. Use them whenever you need.',
              },
              {
                q: 'Can I upgrade my plan?',
                a: 'Yes! You can purchase additional credits or upgrade to unlimited at any time.',
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. All documents are encrypted and we never share your data. Documents are automatically deleted after 30 days.',
              },
            ].map((faq, i) => (
              <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {faq.q}
                </h4>
                <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
