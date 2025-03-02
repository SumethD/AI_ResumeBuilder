import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Edit2, AlertCircle, ThumbsUp } from 'lucide-react';

interface Replacement {
  target: string;
  replacement: string;
  section: string;
  applied?: boolean;
  id?: string;
}

interface AnalysisResult {
  atsScore: number;
  keywordScore: number;
  formatScore: number;
  missingKeywords: string[];
  suggestedLines: { content: string; section: string }[];
  insertPositions: Array<{
    content: string;
    style: string;
    section: string;
  }>;
  replacements: Replacement[];
  recommendations: {
    formatImprovements: string[];
    keywordOptimization: string[];
  };
}

interface ResumeEditorProps {
  resumeText: string;
  analysis: AnalysisResult | null;
  onSave: (editedContent: string, appliedReplacements: Replacement[]) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeText, analysis, onSave }) => {
  const [editableContent, setEditableContent] = useState<string>('');
  const [activeReplacements, setActiveReplacements] = useState<Replacement[]>([]);
  const [appliedReplacements, setAppliedReplacements] = useState<Replacement[]>([]);
  const [highlightedReplacement, setHighlightedReplacement] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize editor content
  useEffect(() => {
    if (resumeText) {
      // Convert plain text to HTML with proper line breaks and formatting
      const formattedText = resumeText
        .split('\n')
        .map(line => {
          // Check if line is a section header (all caps or has colon)
          if (line.toUpperCase() === line && line.trim().length > 0) {
            return `<h2 class="text-xl font-bold my-3">${line}</h2>`;
          }
          // Check if line is a bullet point
          else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return `<div class="ml-4 my-1">${line}</div>`;
          }
          // Regular line
          else if (line.trim().length > 0) {
            return `<div class="my-1">${line}</div>`;
          }
          // Empty line
          return '<div class="my-2"></div>';
        })
        .join('');
      
      setEditableContent(formattedText);
    }
  }, [resumeText]);

  // Set up replacements when analysis changes
  useEffect(() => {
    if (analysis && analysis.replacements) {
      // Add unique IDs to replacements if they don't have them
      const replacementsWithIds = analysis.replacements.map((replacement, index) => ({
        ...replacement,
        id: replacement.id || `replacement-${index}`
      }));
      setActiveReplacements(replacementsWithIds);
    }
  }, [analysis]);

  // Highlight text in the editor when hovering over a suggestion
  const highlightText = (text: string | null) => {
    setHighlightedReplacement(text);
    
    if (editorRef.current && text) {
      // Remove any existing highlights
      const existingHighlights = editorRef.current.querySelectorAll('.bg-yellow-200');
      existingHighlights.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        }
      });
      
      // Add new highlight if text is provided
      const editorContent = editorRef.current.innerHTML;
      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlightedContent = editorContent.replace(
        new RegExp(escapedText, 'g'),
        `<span class="bg-yellow-200">${text}</span>`
      );
      editorRef.current.innerHTML = highlightedContent;
    } else if (editorRef.current) {
      // Just remove highlights if no text provided
      const existingHighlights = editorRef.current.querySelectorAll('.bg-yellow-200');
      existingHighlights.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        }
      });
    }
  };

  // Apply a replacement to the content
  const applyReplacement = (replacement: Replacement) => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const escapedTarget = replacement.target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const updatedContent = content.replace(
        new RegExp(escapedTarget, 'g'),
        replacement.replacement
      );
      
      editorRef.current.innerHTML = updatedContent;
      
      // Update state to track applied replacements
      setAppliedReplacements(prev => [...prev, { ...replacement, applied: true }]);
      setActiveReplacements(prev => prev.filter(r => r.id !== replacement.id));
    }
  };

  // Reject a replacement
  const rejectReplacement = (replacementId: string | undefined) => {
    if (replacementId) {
      setActiveReplacements(prev => prev.filter(r => r.id !== replacementId));
    }
  };

  // Edit a replacement
  const editReplacement = (replacement: Replacement, newText: string) => {
    const updatedReplacement = { ...replacement, replacement: newText };
    setActiveReplacements(prev => 
      prev.map(r => r.id === replacement.id ? updatedReplacement : r)
    );
  };

  // Handle save
  const handleSave = () => {
    if (editorRef.current) {
      const finalContent = editorRef.current.innerHTML;
      onSave(finalContent, appliedReplacements);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-black/20 rounded-xl p-4">
      {/* Editor Panel */}
      <div className="flex-1 bg-white text-black rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-100 p-3 border-b border-gray-200">
          <h3 className="font-medium">Resume Editor</h3>
        </div>
        <div 
          ref={editorRef}
          className="p-6 min-h-[500px] max-h-[700px] overflow-y-auto"
          contentEditable={true}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: editableContent }}
        />
      </div>
      
      {/* Suggestions Panel */}
      <div className="w-full lg:w-96 bg-black/30 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#BCE784]/20 p-3 border-b border-[#BCE784]/30">
          <h3 className="font-medium text-[#BCE784]">AI Suggestions</h3>
          <p className="text-sm text-white/70 mt-1">
            Review and apply suggestions to improve your resume
          </p>
        </div>
        
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {activeReplacements.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <ThumbsUp className="w-12 h-12 mx-auto mb-3 text-[#BCE784]/50" />
              <p>No more suggestions to review!</p>
              {appliedReplacements.length > 0 && (
                <p className="mt-2 text-sm">
                  You've applied {appliedReplacements.length} improvements to your resume.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeReplacements.map((replacement) => (
                <div 
                  key={replacement.id}
                  className="bg-white/10 rounded-lg p-4 border border-[#BCE784]/30 hover:border-[#BCE784] transition-colors"
                  onMouseEnter={() => highlightText(replacement.target)}
                  onMouseLeave={() => highlightText(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-[#BCE784]">
                      {replacement.section}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => applyReplacement(replacement)}
                        className="p-1 rounded-full hover:bg-[#BCE784]/20"
                        title="Apply suggestion"
                      >
                        <CheckCircle className="w-5 h-5 text-[#BCE784]" />
                      </button>
                      <button 
                        onClick={() => rejectReplacement(replacement.id)}
                        className="p-1 rounded-full hover:bg-red-500/20"
                        title="Reject suggestion"
                      >
                        <XCircle className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-white/70 mb-1">Original:</div>
                    <div className="bg-black/30 p-2 rounded text-sm line-through text-white/50">
                      {replacement.target}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-[#BCE784] mb-1">Suggested:</div>
                    <div className="bg-[#BCE784]/10 p-2 rounded text-sm font-medium">
                      {replacement.replacement}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button 
                      className="text-xs flex items-center text-white/70 hover:text-[#BCE784] transition-colors"
                      onClick={() => {
                        const newText = prompt('Edit suggestion:', replacement.replacement);
                        if (newText) {
                          editReplacement(replacement, newText);
                        }
                      }}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit suggestion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-[#BCE784]/30 bg-black/40">
          <button
            onClick={handleSave}
            disabled={appliedReplacements.length === 0}
            className="w-full bg-[#BCE784] text-black px-4 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Save and Download Resume (HTML & DOCX)
          </button>
          
          <div className="mt-4">
            <div className="flex items-center text-sm text-white/70 mb-2">
              <AlertCircle className="w-4 h-4 mr-1 text-[#BCE784]" />
              <span>Applied {appliedReplacements.length} of {appliedReplacements.length + activeReplacements.length} suggestions</span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-[#BCE784] h-2 rounded-full" 
                style={{ 
                  width: `${appliedReplacements.length / (appliedReplacements.length + activeReplacements.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor; 