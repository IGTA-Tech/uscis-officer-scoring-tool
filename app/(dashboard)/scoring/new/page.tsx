'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  AlertCircle,
  Loader2,
  Scale,
  X,
} from 'lucide-react';

type DocumentType = 'full_petition' | 'rfe_response' | 'exhibit_packet' | 'contract_deal_memo';
type VisaType = 'O-1A' | 'O-1B' | 'P-1A' | 'EB-1A';

interface UploadedFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  category?: string;
}

export default function NewScoringPage() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState<DocumentType>('full_petition');
  const [visaType, setVisaType] = useState<VisaType>('O-1A');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentTypes: { value: DocumentType; label: string; description: string }[] = [
    { value: 'full_petition', label: 'Full Petition', description: 'Complete visa petition package' },
    { value: 'rfe_response', label: 'RFE Response', description: 'Response to Request for Evidence' },
    { value: 'exhibit_packet', label: 'Exhibit Packet', description: 'Evidence exhibits and supporting documents' },
    { value: 'contract_deal_memo', label: 'Contract/Deal Memo', description: 'Employment agreements and deal memos' },
  ];

  const visaTypes: { value: VisaType; label: string }[] = [
    { value: 'O-1A', label: 'O-1A (Extraordinary Ability)' },
    { value: 'O-1B', label: 'O-1B (Arts/Entertainment)' },
    { value: 'P-1A', label: 'P-1A (Internationally Recognized Athlete)' },
    { value: 'EB-1A', label: 'EB-1A (Extraordinary Ability Green Card)' },
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      file,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
      file,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('visaType', visaType);
      if (beneficiaryName) {
        formData.append('beneficiaryName', beneficiaryName);
      }

      files.forEach((f, index) => {
        formData.append(`file${index}`, f.file);
      });

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Handle upload response with better error handling
      let uploadData;
      try {
        uploadData = await uploadResponse.json();
      } catch {
        throw new Error('Server error during upload. Please try again with a smaller file.');
      }

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      const sessionId = uploadData.sessionId;

      setIsUploading(false);
      setIsScoring(true);

      const scoreResponse = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      // Handle score response with better error handling
      let scoreData;
      try {
        scoreData = await scoreResponse.json();
      } catch {
        throw new Error('Server timeout during scoring. Large documents may take longer to process. Please try again.');
      }

      if (!scoreResponse.ok) {
        throw new Error(scoreData.error || scoreData.message || 'Scoring failed');
      }

      router.push(`/scoring/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsUploading(false);
      setIsScoring(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Petition Scoring</h1>
        <p className="text-gray-600">
          Upload your documents for evaluation by our AI USCIS officer.
        </p>
      </div>

      {/* Document Type Selection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Type</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {documentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setDocumentType(type.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                documentType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-medium ${documentType === type.value ? 'text-blue-700' : 'text-gray-900'}`}>
                {type.label}
              </div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visa Type Selection */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Visa Type</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {visaTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setVisaType(type.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                visaType === type.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`font-medium ${visaType === type.value ? 'text-blue-700' : 'text-gray-900'}`}>
                {type.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Beneficiary Name */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Beneficiary Name (Optional)</h2>
        <input
          type="text"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          placeholder="Enter beneficiary name"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h2>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
        >
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-900 font-medium mb-2">
              Drag & drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, Word, images (up to 150MB per file)
            </p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium text-sm">{f.file.name}</div>
                    <div className="text-gray-500 text-xs">
                      {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                      {f.category && ` • ${f.category}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {documentType === 'rfe_response' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-sm">
              <strong>For RFE Response scoring:</strong> Please upload both the original
              RFE from USCIS and your response document.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading || isScoring}
        className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/30 disabled:shadow-none"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading Documents...
          </>
        ) : isScoring ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Officer is Reviewing...
          </>
        ) : (
          <>
            <Scale className="w-5 h-5" />
            Start Petition Scoring
          </>
        )}
      </button>
    </div>
  );
}
