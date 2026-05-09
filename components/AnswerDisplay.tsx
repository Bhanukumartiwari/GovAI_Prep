import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface AnswerDisplayProps {
  answer: string;
  title?: string;
  onRefresh?: () => void;
  onGenerateMore?: () => void;
  onDownload?: () => void;
  isLoading?: boolean;
  isGeneratingMore?: boolean;
  generateMoreTooltip?: string;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ 
  answer, 
  title = "AI Generated Answer",
  onRefresh,
  onGenerateMore,
  onDownload,
  isLoading,
  isGeneratingMore,
  generateMoreTooltip = 'Get more details'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(answer);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!answer) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg flex items-start gap-4">
        <div className="flex-shrink-0">
          <LightbulbIcon />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Ready to help!</h3>
          <p className="text-blue-700 mt-1">Your generated content will appear here once you make a request.</p>
        </div>
      </div>
    );
  }

  const actionButtonClasses = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">{title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {onRefresh && (
            <button onClick={onRefresh} disabled={isLoading || isGeneratingMore} className={actionButtonClasses} title="Regenerate the answer">
              <RefreshIcon /> <span className="hidden sm:inline">Refresh</span>
            </button>
          )}
          {onGenerateMore && (
            <button onClick={onGenerateMore} disabled={isLoading || isGeneratingMore} className={actionButtonClasses} title={generateMoreTooltip}>
              {isGeneratingMore ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <PlusIcon />}
              <span className="hidden sm:inline">{isGeneratingMore ? 'Generating...' : 'Generate More'}</span>
            </button>
          )}
           {onDownload && (
            <button onClick={onDownload} disabled={isLoading || isGeneratingMore || !answer} className={actionButtonClasses} title="Download as Markdown file">
              <DownloadIcon /> <span className="hidden sm:inline">Download</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className={actionButtonClasses}
            aria-label="Copy answer to clipboard"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className="markdown-body">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
};