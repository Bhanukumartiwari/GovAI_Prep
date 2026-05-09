import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <div className="relative">
      {isLoading && <Loader />}
      
      <div className="relative z-10">
          <QuestionForm 
            question={question} 
            setQuestion={setQuestion} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                {error}
            </div>
          )}
          
          <div className="mt-10">
            <AnimatePresence>
                {answer && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnswerDisplay answer={answer} title="AI Response" />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};
