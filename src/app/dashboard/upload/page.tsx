"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, X, CheckCircle, ArrowRight, Bot, Send, X as XIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { layout as l, upload as u } from "@/lib/theme";
import { useAuthStore } from "@/store/auth-store";
import { DocReviewLogo } from "@/components/dashboard/logo";
import { useAISuggestions } from "@/hooks/useAisuggestions";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded: boolean;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isAISuggestionMode, setIsAISuggestionMode] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuthStore();
  const aiSuggestions = useAISuggestions();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = useCallback((id: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, uploaded: true } : file
      )
    );
  }, []);

  const handleSubmitClick = useCallback(() => {
    if (uploadedFiles.length > 0) {
      setShowSubmitDialog(true);
    }
  }, [uploadedFiles]);

  const handleRevert = useCallback(() => {
    setIsAISuggestionMode(false);
    aiSuggestions.clearSuggestions();
  }, [aiSuggestions]);

  const handleAccept = useCallback(async () => {
    if (!aiSuggestions.suggestions || uploadedFiles.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate document generation with AI suggestions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a document content based on AI suggestions
      const documentContent = `
AI-Enhanced Document Analysis
================================

Original Document: ${uploadedFiles[0].name}
Generated on: ${new Date().toLocaleDateString()}

AI Analysis Summary:
${aiSuggestions.suggestions.summary}

Risk Flags Identified:
${aiSuggestions.suggestions.riskFlags.map(flag => `  - ${flag}`).join('\n')}

Recommendations:
${aiSuggestions.suggestions.recommendations.map(rec => `  - ${rec}`).join('\n')}

Additional Suggestions:
${aiSuggestions.suggestions.moreSuggestions.map(suggestion => `  - ${suggestion}`).join('\n')}

---
This document was generated using AI analysis powered by DocuReview.
      `.trim();
      
      // Create blob and download URL
      const blob = new Blob([documentContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setGeneratedDocument(url);
      
    } catch (error) {
      console.error('Document generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [aiSuggestions.suggestions, uploadedFiles]);

  const handleDecline = useCallback(() => {
    // Clear everything
    setUploadedFiles([]);
    setIsAISuggestionMode(false);
    aiSuggestions.clearSuggestions();
    setGeneratedDocument(null);
  }, [aiSuggestions]);

  const handleDownload = useCallback(() => {
    if (!generatedDocument) return;
    
    const link = document.createElement('a');
    link.href = generatedDocument;
    link.download = `AI-Analyzed-${uploadedFiles[0]?.name || 'document'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL after download
    URL.revokeObjectURL(generatedDocument);
    setGeneratedDocument(null);
  }, [generatedDocument, uploadedFiles]);

  return (
    <div className={l.page}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-1 mb-4">
            <DocReviewLogo destination="/dashboard/upload" />
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome {user?.firstName || user?.email?.split('@')[0] || 'User'}</h1>
          </div>
          <p className="text-slate-600">Ready to upload your documents for AI review</p>
        </div>

        <div className="w-full max-w-3xl">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div
              className={`border-2 border-dashed rounded-xl transition-all duration-200 ${
                uploadedFiles.length > 0 
                  ? 'border-slate-300 p-4' 
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 p-4 h-[50px] flex items-center'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {uploadedFiles.length === 0 ? (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-sm text-slate-500">upload your documents</span>
                  </div>
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">select doc</span>
                  </label>
                </>
              ) : (
                <>
                                    
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-shrink-0">
                          {file.uploaded ? (
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                          ) : (
                            <FileText className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(file.size)} {file.type || 'Unknown type'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isAISuggestionMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="px-2 py-1 text-slate-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-slate-300">
                    <div></div>
                    <div className="flex items-center gap-3">
                      {!isAISuggestionMode ? (
                        <>
                          <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors bg-slate-50 px-3 py-2 rounded-lg"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">select more doc</span>
                          </label>
                          <button 
                            onClick={handleSubmitClick}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-400 text-slate-700 hover:bg-slate-500 transition-colors cursor-pointer"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={handleRevert}
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Revert to modify documents"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        
        {/* AI Suggestions Card */}
        {(aiSuggestions.suggestions || aiSuggestions.loading) && (
          <div className="w-full max-w-3xl mt-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                {aiSuggestions.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    <h2 className="text-lg font-semibold text-slate-800">Processing AI Suggestions...</h2>
                  </div>
                ) : (
                  <>
                    <Bot className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-slate-800">AI Suggestions</h2>
                  </>
                )}
              </div>
              
              {aiSuggestions.error && (
                <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  Error: {aiSuggestions.error}
                </div>
              )}
              
              {aiSuggestions.loading ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600">Analyzing your document...</p>
                        <p className="text-xs text-slate-500">This may take a few moments</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Summary</h3>
                  <p className="text-sm text-slate-600">{aiSuggestions.suggestions?.summary}</p>
                </div>
                
                {aiSuggestions.suggestions?.riskFlags && aiSuggestions.suggestions.riskFlags.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <h3 className="text-sm font-medium text-orange-700 mb-2">Risk Flags</h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {aiSuggestions.suggestions.riskFlags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiSuggestions.suggestions?.recommendations && aiSuggestions.suggestions.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Recommendations</h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {aiSuggestions.suggestions.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiSuggestions.suggestions?.moreSuggestions && aiSuggestions.suggestions.moreSuggestions.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <h3 className="text-sm font-medium text-green-700 mb-2">More Suggestions</h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {aiSuggestions.suggestions.moreSuggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              )}
              
              {/* Accept/Decline Buttons */}
              {!aiSuggestions.loading && aiSuggestions.suggestions && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  {generatedDocument ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-lg font-semibold text-slate-800">Document Generated Successfully!</h3>
                        </div>
                        <p className="text-sm text-slate-600">
                          Your AI-enhanced document is ready for download.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="mybutton"
                          onClick={handleDownload}
                          className="px-4 py-2 cursor-pointer"
                        >
                          Download Document
                        </Button>
                        <Button
                          variant="mycancel"
                          onClick={handleDecline}
                          className="px-4 py-2 hover:bg-slate-700 hover:text-white cursor-pointer"
                        >
                          Start New Analysis
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-slate-600 flex-1">
                        Would you like to generate an enhanced document with these AI suggestions?
                      </p>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="mybutton"
                          onClick={handleAccept}
                          disabled={isGenerating}
                          className="px-4 py-2 cursor-pointer"
                        >
                          {isGenerating ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent mr-2" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept & Generate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="mycancel"
                          onClick={handleDecline}
                          className="px-4 py-2 hover:bg-slate-700 hover:text-white cursor-pointer"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Decline & Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 w-full max-w-2xl relative">
            <button
              onClick={() => setShowSubmitDialog(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <XIcon className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Submit Documents</h2>
              
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                How would you like to process {uploadedFiles.length > 0 ? uploadedFiles[0].name : 'your document'}?
              </p>
            </div>
              
              <div className="space-y-3 w-full">
                <Button
                  variant="mycancel"
                  className="w-full py-3 text-base flex items-center justify-center gap-2 bg-slate-500 text-white hover:bg-slate-600 hover:text-white cursor-pointer"
                  onClick={() => {
                    if (uploadedFiles.length > 0) {
                      aiSuggestions.fetchAISuggestions(uploadedFiles[0].name);
                      setIsAISuggestionMode(true);
                    }
                    setShowSubmitDialog(false);
                  }}
                  disabled={aiSuggestions.loading}
                >
                  {aiSuggestions.loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-300" />
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      AI Suggestion
                    </>
                  )}
                </Button>
                <Button
                  variant="mycancel"
                  className="w-full py-3 text-base flex items-center justify-center gap-2 hover:bg-slate-500 hover:text-white cursor-pointer"
                  onClick={() => {
                    // Handle sent to reviewer logic here
                    setShowSubmitDialog(false);
                  }}
                >
                  <Send className="h-4 w-4" />
                  Sent to Reviewer
                </Button>
              </div>
            </div>
        </div>
      )}
      </div>
    </div>
  );
}