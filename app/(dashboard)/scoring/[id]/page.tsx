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
  Download,
  Mail,
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
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'Approve' || rating === 'Strong') return 'bg-green-100 text-green-700 border-green-300';
    if (rating === 'RFE Likely' || rating === 'Adequate') return 'bg-amber-100 text-amber-700 border-amber-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const handleExportPDF = async () => {
    window.open(`/api/export/pdf?sessionId=${sessionId}&format=pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-red-600">{error || 'Results not found'}</p>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Officer Assessment</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <span className={`px-4 py-2 rounded-full border font-medium ${getRatingColor(results.overallRating)}`}>
                  {results.overallRating}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className={`text-center p-4 rounded-xl border ${getScoreBg(results.overallScore)}`}>
                <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                  {results.overallScore}
                </div>
                <div className="text-gray-600 text-sm mt-1">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-4xl font-bold text-green-600">{results.approvalProbability}%</div>
                <div className="text-gray-600 text-sm mt-1">Approval</div>
              </div>
              <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="text-4xl font-bold text-amber-500">{results.rfeProbability}%</div>
                <div className="text-gray-600 text-sm mt-1">RFE Likely</div>
              </div>
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="text-4xl font-bold text-red-500">{results.denialRisk}%</div>
                <div className="text-gray-600 text-sm mt-1">Denial Risk</div>
              </div>
            </div>

            {/* Filing Recommendation */}
            <div className={`p-4 rounded-xl border ${getRatingColor(results.overallRating)}`}>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Criterion-by-Criterion Analysis</h2>
            <div className="space-y-3">
              {results.criteriaScores.map((criterion, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCriterion(index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`font-bold text-lg ${getScoreColor(criterion.score)}`}>
                        {criterion.score}/100
                      </span>
                      <span className="text-gray-900 font-medium">
                        Criterion {criterion.criterionNumber}: {criterion.criterionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRatingColor(criterion.rating)}`}>
                        {criterion.rating}
                      </span>
                      {expandedCriteria.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedCriteria.includes(index) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-amber-600 mb-2">Officer&apos;s Concerns:</h4>
                      <ul className="space-y-2">
                        {criterion.officerConcerns.length > 0 ? (
                          criterion.officerConcerns.map((concern, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              {concern}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500">No specific concerns noted</li>
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">RFE Predictions</h2>
              <div className="space-y-3">
                {results.rfePredictions.map((rfe, index) => (
                  <div key={index} className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-amber-700">{rfe.topic}</span>
                      <span className="text-amber-600 font-bold">{rfe.probability}% likely</span>
                    </div>
                    <p className="text-sm text-gray-700">{rfe.officerPerspective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h2>

            {results.recommendations.critical.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-red-600 mb-3 uppercase tracking-wide">Critical - Must Do</h3>
                <ul className="space-y-2">
                  {results.recommendations.critical.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations.high.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-amber-600 mb-3 uppercase tracking-wide">High Priority - Should Do</h3>
                <ul className="space-y-2">
                  {results.recommendations.high.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.recommendations.recommended.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-green-600 mb-3 uppercase tracking-wide">Recommended - Would Help</h3>
                <ul className="space-y-2">
                  {results.recommendations.recommended.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Full Report Toggle */}
          {results.fullReport && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <button
                onClick={() => setShowFullReport(!showFullReport)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FileText className="w-5 h-5" />
                {showFullReport ? 'Hide' : 'Show'} Full Officer Report
              </button>
              {showFullReport && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 overflow-auto max-h-[600px]">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {results.fullReport}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Panel - 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-20 shadow-sm">
            <div
              className="p-4 bg-blue-600 flex items-center justify-between cursor-pointer"
              onClick={() => setShowChat(!showChat)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">Chat with Officer</span>
              </div>
              {showChat ? (
                <ChevronDown className="w-5 h-5 text-white/70" />
              ) : (
                <ChevronUp className="w-5 h-5 text-white/70" />
              )}
            </div>

            {showChat && (
              <>
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">Ask the officer about your score</p>
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
                        className={`max-w-[85%] p-3 rounded-xl ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-xl">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask about your score..."
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!chatInput.trim() || isSending}
                      className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-xl transition-colors"
                    >
                      <Send className="w-5 h-5 text-white" />
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
