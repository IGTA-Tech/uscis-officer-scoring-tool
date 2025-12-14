'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

interface ScoringResults {
  overallScore: number;
  overallRating: string;
  approvalProbability: number;
  rfeProbability: number;
  denialRisk: number;
  criteriaScores: Array<{
    criterionNumber: number;
    criterionName: string;
    rating: string;
    score: number;
    officerConcerns: string[];
  }>;
  evidenceQuality: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    tier4Count: number;
    overallAssessment: string;
  };
  rfePredictions: Array<{
    topic: string;
    probability: number;
    officerPerspective: string;
  }>;
  weaknesses: string[];
  strengths: string[];
  recommendations: {
    critical: string[];
    high: string[];
    recommended: string[];
  };
  fullReport?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function ScoringResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [results, setResults] = useState<ScoringResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Expanded sections
  const [expandedCriteria, setExpandedCriteria] = useState<number[]>([]);
  const [showFullReport, setShowFullReport] = useState(false);

  // Fetch results
  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch(`/api/score?sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await response.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    async function fetchChatHistory() {
      try {
        const response = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setChatMessages(data.messages || []);
        }
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    }

    fetchResults();
    fetchChatHistory();
  }, [sessionId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Send chat message
  const sendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: chatInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const toggleCriterion = (index: number) => {
    setExpandedCriteria((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'Approve' || rating === 'Strong') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (rating === 'RFE Likely' || rating === 'Adequate') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Results</h2>
          <p className="text-red-400">{error || 'Results not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Results - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Card */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Officer Assessment</h1>
              <span className={`px-4 py-2 rounded-full border ${getRatingColor(results.overallRating)}`}>
                {results.overallRating}
              </span>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                  {results.overallScore}
                </div>
                <div className="text-slate-400 text-sm">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="text-4xl font-bold text-green-500">{results.approvalProbability}%</div>
                <div className="text-slate-400 text-sm">Approval</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="text-4xl font-bold text-amber-500">{results.rfeProbability}%</div>
                <div className="text-slate-400 text-sm">RFE Likely</div>
              </div>
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="text-4xl font-bold text-red-500">{results.denialRisk}%</div>
                <div className="text-slate-400 text-sm">Denial Risk</div>
              </div>
            </div>

            {/* Filing Recommendation */}
            <div className={`p-4 rounded-lg border ${getRatingColor(results.overallRating)}`}>
              <div className="font-semibold mb-1">Filing Recommendation</div>
              <div className="text-sm">
                {results.overallScore >= 70
                  ? 'This petition appears ready to file. Minor improvements may still be beneficial.'
                  : results.overallScore >= 50
                  ? 'Consider strengthening the petition before filing. RFE is likely with current evidence.'
                  : 'Major revision recommended. Significant weaknesses need to be addressed before filing.'}
              </div>
            </div>
          </div>

          {/* Criterion Breakdown */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Criterion-by-Criterion Analysis</h2>
            <div className="space-y-3">
              {results.criteriaScores.map((criterion, index) => (
                <div key={index} className="border border-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCriterion(index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${getScoreColor(criterion.score)}`}>
                        {criterion.score}/100
                      </span>
                      <span className="text-white">
                        Criterion {criterion.criterionNumber}: {criterion.criterionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs ${getRatingColor(criterion.rating)}`}>
                        {criterion.rating}
                      </span>
                      {expandedCriteria.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                  {expandedCriteria.includes(index) && (
                    <div className="p-4 bg-slate-700/30 border-t border-slate-700">
                      <h4 className="text-sm font-semibold text-amber-500 mb-2">Officer&apos;s Concerns:</h4>
                      <ul className="space-y-1">
                        {criterion.officerConcerns.length > 0 ? (
                          criterion.officerConcerns.map((concern, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              {concern}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-slate-400">No specific concerns noted</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RFE Predictions */}
          {results.rfePredictions.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">RFE Predictions</h2>
              <div className="space-y-3">
                {results.rfePredictions.map((rfe, index) => (
                  <div key={index} className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-amber-400">{rfe.topic}</span>
                      <span className="text-amber-500 font-bold">{rfe.probability}% likely</span>
                    </div>
                    <p className="text-sm text-slate-300">{rfe.officerPerspective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recommendations</h2>

            {results.recommendations.critical.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">CRITICAL - Must Do</h3>
                <ul className="space-y-2">
                  {results.recommendations.critical.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations.high.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-amber-400 mb-2">HIGH PRIORITY - Should Do</h3>
                <ul className="space-y-2">
                  {results.recommendations.high.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations.recommended.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">RECOMMENDED - Would Help</h3>
                <ul className="space-y-2">
                  {results.recommendations.recommended.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Full Report Toggle */}
          {results.fullReport && (
            <div className="bg-slate-800 rounded-xl p-6">
              <button
                onClick={() => setShowFullReport(!showFullReport)}
                className="flex items-center gap-2 text-amber-500 hover:text-amber-400"
              >
                <FileText className="w-5 h-5" />
                {showFullReport ? 'Hide' : 'Show'} Full Officer Report
              </button>
              {showFullReport && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg overflow-auto max-h-[600px]">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                    {results.fullReport}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Panel - 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl overflow-hidden sticky top-4">
            <div
              className="p-4 bg-slate-700 flex items-center justify-between cursor-pointer"
              onClick={() => setShowChat(!showChat)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-white">Chat with Officer</span>
              </div>
              {showChat ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {showChat && (
              <>
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-400 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Ask the officer about your score</p>
                      <p className="text-sm mt-2">
                        Try: &quot;Why did I score low on the awards criterion?&quot;
                      </p>
                    </div>
                  )}

                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask about your score..."
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!chatInput.trim() || isSending}
                      className="p-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Send className="w-5 h-5 text-slate-900" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
