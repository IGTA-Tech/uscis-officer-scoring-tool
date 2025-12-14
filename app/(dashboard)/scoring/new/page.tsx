'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Scale,
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
    { value: 'rfe_response', label: 'RFE Response', description: 'Response to Request for Evidence (include original RFE)' },
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
      // Create form data for upload
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('visaType', visaType);
      if (beneficiaryName) {
        formData.append('beneficiaryName', beneficiaryName);
      }

      files.forEach((f, index) => {
        formData.append(`file${index}`, f.file);
      });

      // Upload files
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const sessionId = uploadData.sessionId;

      // Start scoring
      setIsUploading(false);
      setIsScoring(true);

      const scoreResponse = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!scoreResponse.ok) {
        const data = await scoreResponse.json();
        throw new Error(data.error || 'Scoring failed');
      }

      // Redirect to results page
      router.push(`/scoring/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsUploading(false);
      setIsScoring(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">New Officer Scoring</h1>
        <p className="text-slate-400">
          Upload your documents for evaluation by our AI USCIS officer.
        </p>
      </div>

      {/* Document Type Selection */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Document Type</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {documentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setDocumentType(type.value)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                documentType === type.value
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="font-medium text-white">{type.label}</div>
              <div className="text-sm text-slate-400">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visa Type Selection */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Visa Type</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {visaTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setVisaType(type.value)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                visaType === type.value
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="font-medium text-white">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Beneficiary Name */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Beneficiary Name (Optional)</h2>
        <input
          type="text"
          value={beneficiaryName}
          onChange={(e) => setBeneficiaryName(e.target.value)}
          placeholder="Enter beneficiary name"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* File Upload */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Upload Documents</h2>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer"
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
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-white mb-2">
              Drag & drop files here or click to browse
            </p>
            <p className="text-sm text-slate-400">
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
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-white text-sm">{f.file.name}</div>
                    <div className="text-slate-400 text-xs">
                      {(f.file.size / (1024 * 1024)).toFixed(2)} MB
                      {f.category && ` • ${f.category}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-slate-400 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {documentType === 'rfe_response' && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-500 text-sm">
              <strong>For RFE Response scoring:</strong> Please upload both the original
              RFE from USCIS and your response document.
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading || isScoring}
        className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
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
            Start Officer Scoring
          </>
        )}
      </button>
    </div>
  );
}
