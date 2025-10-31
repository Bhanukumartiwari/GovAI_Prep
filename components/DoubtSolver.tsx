import React, { useState } from 'react';
import { QuestionForm } from './QuestionForm';
import { AnswerDisplay } from './AnswerDisplay';
import { Loader } from './Loader';
import { getAnswerFromGemini } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

export const DoubtSolver: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const result = await getAnswerFromGemini(question);
      setAnswer(result);
    } catch (err) {
      setError('Failed to get an answer. Please check your connection and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 relative">
      {isLoading && <Loader />}
      <div className="flex items-center gap-3 mb-6">
        <SparklesIcon />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Doubt Solver</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Stuck on a concept? Get instant, detailed explanations for any question related to the government exam syllabus.
      </p>
      
      <QuestionForm 
        question={question} 
        setQuestion={setQuestion} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      <div className="mt-8">
        <AnswerDisplay answer={answer} />
      </div>
    </div>
  );
};
