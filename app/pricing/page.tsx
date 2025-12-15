'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Zap, Crown, ArrowLeft, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState<string | null>(null);

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
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">
                How It Works
              </Link>
              <Link href="/pricing" className="text-blue-600 font-medium">
                Pricing
              </Link>
            </div>
            <Link
              href="/scoring/new"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start with a free evaluation. Upgrade when you need more.
          </p>
        </div>

        {/* Free Tier */}
        <div className="max-w-md mx-auto mb-12 p-6 rounded-2xl border-2 border-dashed border-green-400 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Free Trial</h3>
              <p className="text-green-700 font-medium">No credit card required</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
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
              className={`relative p-6 rounded-2xl border bg-white ${
                tier.popular
                  ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tier.name}
              </h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {tier.price}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {tier.description}
              </p>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
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
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
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
              <div key={i} className="p-6 rounded-xl bg-white border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Image
              src="/logo.png"
              alt="Xtra Odinary Research"
              width={150}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="text-sm text-center md:text-left">
              This tool provides AI-generated assessments for educational purposes.
              Always consult with a qualified immigration attorney.
            </p>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Xtra Odinary Research
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
