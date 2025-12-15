'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, FileText, MessageSquare, Shield, Sparkles, Download, Mail, Zap, Moon, Sun } from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem('xtraordinary-theme');
    if (theme === 'light') {
      setIsDark(false);
    } else if (!theme && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('xtraordinary-theme', newTheme);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  return (
    <main className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Xtraordinary
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <Link
              href="/pricing"
              className={`text-sm ${isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pricing
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-amber-500" />
            <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Xtraordinary Petition Scoring
            </h1>
          </div>
          <p className={`text-xl max-w-3xl mx-auto mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            Get your visa petition evaluated from the perspective of a senior USCIS adjudications officer.
            Identify weaknesses <span className="text-amber-500 font-semibold">before</span> you file.
          </p>

          {/* Free Trial Banner */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">First evaluation FREE - No credit card required</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scoring/new"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              <Scale className="w-5 h-5" />
              Try Free Scoring
            </Link>
            <Link
              href="/pricing"
              className={`inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-lg text-lg transition-colors border-2 ${
                isDark
                  ? 'border-slate-600 text-white hover:bg-slate-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Multiple Document Types
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Score full petitions, RFE responses, exhibit packets, and contract deal memos.
            </p>
          </div>

          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Devil&apos;s Advocate Review
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Brutally honest evaluation from an officer perspective. Find weaknesses before USCIS does.
            </p>
          </div>

          <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Chat with the Officer
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Ask follow-up questions about your score. Get specific recommendations to strengthen your case.
            </p>
          </div>
        </div>

        {/* Pro Features */}
        <div className={`max-w-4xl mx-auto mb-16 p-8 rounded-2xl border ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Pro Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>PDF Report Export</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Download professional scoring reports</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Results</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Send scoring results directly to your inbox</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>RFE Comparison</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Compare before/after RFE response scores</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Batch Scoring</h4>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Score multiple petitions at once</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visa Types */}
        <div className="text-center mb-16">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Supported Visa Types</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['O-1A', 'O-1B', 'P-1A', 'EB-1A'].map((visa) => (
              <span
                key={visa}
                className={`px-6 py-2 rounded-full font-mono ${isDark ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {visa}
              </span>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Upload', desc: 'Upload your petition documents (PDF, up to 100MB+)' },
              { step: '2', title: 'Select', desc: 'Choose document type and visa category' },
              { step: '3', title: 'Score', desc: 'AI officer reviews and scores your petition' },
              { step: '4', title: 'Chat', desc: 'Ask questions and get recommendations' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t py-8 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className={`container mx-auto px-4 text-center ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          <p>
            This tool provides AI-generated assessments for educational purposes.
            <br />
            Always consult with a qualified immigration attorney.
          </p>
          <p className="mt-4 text-sm">
            &copy; {new Date().getFullYear()} Xtraordinary Petition Scoring. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
