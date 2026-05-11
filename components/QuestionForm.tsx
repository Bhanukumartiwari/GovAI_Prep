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
    <div className="flex flex-col gap-6">
      <div className="relative group">
        <textarea
            id="question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="INPUT COMMAND OR CONCEPT_..."
            className="w-full p-10 pr-32 bg-gray-50 border border-gray-100 rounded-[32px] focus:bg-white focus:ring-8 focus:ring-blue-100/30 focus:border-blue-500 transition-all duration-500 resize-none h-56 text-base font-medium text-gray-900 placeholder:text-gray-300 placeholder:uppercase placeholder:tracking-widest"
            disabled={isLoading}
            aria-label="Ask your question"
        />
        <div className="absolute bottom-8 right-8">
            <button
                onClick={onSubmit}
                disabled={isLoading || !question.trim()}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl shadow-xl hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all duration-300 active:scale-95 text-[10px] font-black uppercase tracking-widest"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        SYS.PROCESS
                    </span>
                ) : (
                    "Execute"
                )}
            </button>
        </div>
      </div>
      <div className="flex items-center gap-6 px-6 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">Archives</span>
        </div>
        {[
            "Explain GST structure",
            "What is Fundamental Rights?",
            "Mock test on Polity",
            "Current Affairs strategy"
        ].map(label => (
            <button 
                key={label}
                onClick={() => setQuestion(label)}
                className="px-4 py-2 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all whitespace-nowrap"
            >
                {label}
            </button>
        ))}
      </div>
    </div>
  );
};
