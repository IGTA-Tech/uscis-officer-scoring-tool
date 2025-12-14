'use client';

import Link from 'next/link';
import { Scale, FileText, MessageSquare, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              USCIS Officer Scoring Tool
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Get your visa petition evaluated from the perspective of a senior USCIS adjudications officer.
            Identify weaknesses <span className="text-amber-500 font-semibold">before</span> you file.
          </p>
          <Link
            href="/scoring/new"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            <Scale className="w-5 h-5" />
            Start Scoring
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Multiple Document Types
            </h3>
            <p className="text-slate-400">
              Score full petitions, RFE responses, exhibit packets, and contract deal memos.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Devil&apos;s Advocate Review
            </h3>
            <p className="text-slate-400">
              Brutally honest evaluation from an officer perspective. Find weaknesses before USCIS does.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Chat with the Officer
            </h3>
            <p className="text-slate-400">
              Ask follow-up questions about your score. Get specific recommendations to strengthen your case.
            </p>
          </div>
        </div>

        {/* Visa Types */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Supported Visa Types</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['O-1A', 'O-1B', 'P-1A', 'EB-1A'].map((visa) => (
              <span
                key={visa}
                className="px-6 py-2 bg-slate-700 text-white rounded-full font-mono"
              >
                {visa}
              </span>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
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
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>
            This tool provides AI-generated assessments for educational purposes.
            <br />
            Always consult with a qualified immigration attorney.
          </p>
        </div>
      </footer>
    </main>
  );
}
