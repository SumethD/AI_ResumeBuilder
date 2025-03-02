import React, { ChangeEvent, useState } from 'react';

interface SummaryFormProps {
  data: string;
  onChange: (summary: string) => void;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ data, onChange }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [originalSummary, setOriginalSummary] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleImproveWithAI = () => {
    // Save the original summary in case user wants to revert
    setOriginalSummary(data);
    setIsImproving(true);
    
    // This would ideally call an AI service to improve the summary
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      const improvedSummary = `${data}\n\nAdditionally, I excel at problem-solving and have a proven track record of delivering high-quality results on time and within budget.`;
      onChange(improvedSummary);
      setIsImproving(false);
    }, 1500);
  };

  const handleRetry = () => {
    onChange(originalSummary);
  };

  return (
    <div className="bg-black/30 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-[#BCE784] mb-6">Professional Summary</h2>
      <p className="text-white/70 mb-6">
        Your professional summary is the first thing recruiters read. Make it compelling and concise.
      </p>
      
      <div>
        <label htmlFor="summary" className="block text-white mb-2">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          value={data || ''}
          onChange={handleInputChange}
          rows={8}
          className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
          placeholder="Write a brief summary of your professional background, skills, and career goals..."
        />
      </div>
      
      <div className="flex space-x-4 mt-4">
        <button
          type="button"
          onClick={handleImproveWithAI}
          disabled={isImproving || !data}
          className={`px-5 py-2.5 rounded-lg flex items-center space-x-2 ${
            isImproving || !data
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-[#BCE784]/20 text-[#BCE784] hover:bg-[#BCE784]/30'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <span>{isImproving ? 'Improving...' : 'Improve with AI'}</span>
        </button>
        
        {originalSummary && (
          <button
            type="button"
            onClick={handleRetry}
            className="bg-white/10 text-white px-5 py-2.5 rounded-lg hover:bg-white/20 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>Retry</span>
          </button>
        )}
      </div>
      
      <div className="mt-8 bg-black/20 p-4 rounded-lg border border-[#BCE784]/20">
        <h3 className="text-[#BCE784] font-medium mb-2">Tips for a great summary</h3>
        <ul className="text-white/70 text-sm space-y-2">
          <li>• Keep it concise (3-5 sentences)</li>
          <li>• Highlight your most relevant skills and achievements</li>
          <li>• Tailor it to the job you're applying for</li>
          <li>• Avoid clichés and generic statements</li>
          <li>• Include years of experience and specializations</li>
        </ul>
      </div>
    </div>
  );
};

export default SummaryForm;