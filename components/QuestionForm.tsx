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
      <label htmlFor="question-input" className="text-lg font-semibold text-gray-700">
        Ask your question
      </label>
      <textarea
        id="question-input"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Explain the main features of the Right to Equality in the Indian Constitution."
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none h-28"
        disabled={isLoading}
        aria-label="Ask your question"
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !question.trim()}
        className="self-end px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? 'Thinking...' : 'Get Answer'}
      </button>
    </div>
  );
};