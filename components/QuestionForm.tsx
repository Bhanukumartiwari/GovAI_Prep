import React from 'react';

interface QuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ question, setQuestion, onSubmit, isLoading }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="relative group">
        <textarea
            id="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question or paste a difficult concept here..."
            className="w-full p-6 pr-16 bg-gray-50 border border-gray-100 rounded-[32px] focus:bg-white focus:ring-8 focus:ring-blue-100/30 focus:border-blue-500 transition-all duration-500 resize-none h-40 text-lg font-medium text-gray-800 placeholder:text-gray-400"
            disabled={isLoading}
            aria-label="Ask your question"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
                onClick={onSubmit}
                disabled={isLoading || !question.trim()}
                className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-2xl shadow-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-300 hover:scale-105 active:scale-95"
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                )}
            </button>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4 overflow-x-auto no-scrollbar pb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Suggested:</span>
        {[
            "Explain GST structure",
            "What is Fundamental Rights?",
            "Mock test on Polity",
            "Current Affairs strategy"
        ].map(label => (
            <button 
                key={label}
                onClick={() => setQuestion(label)}
                className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
                {label}
            </button>
        ))}
      </div>
    </div>
  );
};
