import React, { useState } from 'react';
import { QuizResponse } from '../services/geminiService';
import { CheckIcon } from './icons/CheckIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface QuizDisplayProps {
  quizData: QuizResponse;
  onRegenerate?: () => void;
  onDownload?: () => void;
  isRegenerating?: boolean;
}

export const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizData, onRegenerate, onDownload, isRegenerating }) => {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const toggleAnswer = (index: number) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const actionButtonClasses = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Generated Quiz</h2>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button onClick={onRegenerate} disabled={isRegenerating} className={actionButtonClasses} title="Regenerate Quiz">
               {isRegenerating ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : <RefreshIcon />}
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          )}
          {onDownload && (
            <button onClick={onDownload} disabled={isRegenerating} className={actionButtonClasses} title="Download as PDF">
              <DownloadIcon /> Download
            </button>
          )}
        </div>
      </div>
      {quizData.quiz.map((q, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800 text-lg mb-4">
            {`Q${index + 1}: ${q.question}`}
          </p>
          <div className="space-y-3">
            {Object.entries(q.options).map(([key, value]) => {
              const isRevealed = revealedAnswers[index];
              const isCorrect = key === q.answer;
              let optionClass = "flex items-center gap-3 p-3 border border-gray-200 rounded-md transition-colors";
              
              if (isRevealed) {
                optionClass += isCorrect ? ' bg-green-100 border-green-400 text-green-800 font-semibold' : ' bg-gray-50';
              } else {
                optionClass += ' hover:bg-gray-100';
              }

              return (
                <div key={key} className={optionClass}>
                  <span className={`font-bold ${isRevealed && isCorrect ? '' : 'text-gray-500'}`}>{key}.</span>
                  <span>{value}</span>
                  {isRevealed && isCorrect && <div className="ml-auto"><CheckIcon /></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => toggleAnswer(index)}
              className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
            >
              {revealedAnswers[index] ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};