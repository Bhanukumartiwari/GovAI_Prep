import React, { useState, FormEvent } from 'react';
import { Page } from '../App';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Loader } from '../components/Loader';
import { QuizDisplay } from '../components/QuizDisplay';
import { generateMcqQuiz, QuizResponse } from '../services/geminiService';

interface QuestionGeneratorPageProps {
  onNavigate: (page: Page) => void;
}

export const QuestionGeneratorPage: React.FC<QuestionGeneratorPageProps> = ({ onNavigate }) => {
  const [topic, setTopic] = useState('Indian History');
  const [exam, setExam] = useState('UPSC');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState('');

  const generateNewQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setError('');

    try {
      const result = await generateMcqQuiz(topic, count, exam, difficulty);
      setQuiz(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuiz(null); // Clear quiz on error
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setQuiz(null);
    await generateNewQuiz();
    setIsLoading(false);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await generateNewQuiz();
    setIsRegenerating(false);
  };

  const handleDownload = () => {
    if (!quiz) return;
    
    const title = `Quiz on ${topic} for ${exam}`;
    let quizHtml = '';
    quiz.quiz.forEach((q, index) => {
        quizHtml += `
            <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
                <p><strong>Q${index + 1}: ${q.question}</strong></p>
                <ul>
                    <li>A: ${q.options.A}</li>
                    <li>B: ${q.options.B}</li>
                    <li>C: ${q.options.C}</li>
                    <li>D: ${q.options.D}</li>
                </ul>
                <p><strong>Answer:</strong> ${q.answer}</p>
            </div>
        `;
    });
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 2rem; color: #333; }
                    h1 { color: #000; }
                    strong { font-weight: 600; }
                    ul { list-style-type: none; padding-left: 0; }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 1in; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <hr />
                ${quizHtml}
            </body>
        </html>
    `);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };

  const formInputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200";
  const formLabelClass = "block text-md font-semibold text-gray-700 mb-2";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => onNavigate('tools')}
        className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
      >
        <BackIcon />
        Back to Tools
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
            <GeneratorIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Smart Question Generator</h1>
            <p className="text-gray-600 mt-1">Create custom quizzes on any topic from the syllabus.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <label htmlFor="topic" className={formLabelClass}>Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={formInputClass}
              placeholder="e.g., Modern Indian History"
              required
            />
          </div>
          <div>
            <label htmlFor="exam" className={formLabelClass}>Exam</label>
            <select
              id="exam"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className={formInputClass}
              required
            >
              <option>UPSC</option>
              <option>SSC</option>
              <option>BPSC</option>
              <option>Banking</option>
              <option>Railways</option>
            </select>
          </div>
           <div>
            <label htmlFor="difficulty" className={formLabelClass}>Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={formInputClass}
              required
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="count" className={formLabelClass}>Number of Questions</label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className={formInputClass}
              required
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="lg:col-span-2 flex items-end justify-end">
            <button
              type="submit"
              disabled={isLoading || isRegenerating}
              className="w-full lg:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 relative">
        {isLoading && <Loader />}
        {error && <p className="text-red-500 mt-4 text-center bg-red-50 p-4 rounded-lg">{error}</p>}
        {quiz && <QuizDisplay quizData={quiz} onRegenerate={handleRegenerate} onDownload={handleDownload} isRegenerating={isRegenerating} />}
      </div>
    </div>
  );
};