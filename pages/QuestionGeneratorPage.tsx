import React, { useState, FormEvent } from 'react';
import { Page } from '../App';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { Loader } from '../components/Loader';
import { QuizDisplay } from '../components/QuizDisplay';
import { generateMcqQuiz, QuizResponse } from '../services/geminiService';
import { XCircleIcon } from '../components/icons/XCircleIcon';

interface QuestionGeneratorPageProps {
  onNavigate: (page: Page) => void;
  onAction?: (message: string, type?: string) => void;
}

export const QuestionGeneratorPage: React.FC<QuestionGeneratorPageProps> = ({ onNavigate, onAction }) => {
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
      if (onAction) {
        onAction(`Generated a ${count}-question quiz on ${topic} (${exam})`, 'quiz');
      }
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
    
    const title = `Knowledge Assessment: ${topic}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let quizHtml = '';
    quiz.quiz.forEach((q, index) => {
        quizHtml += `
            <div style="margin-bottom: 3rem; page-break-inside: avoid;">
                <div style="font-[700] text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: #3b82f6; margin-bottom: 0.5rem;">OBJECTIVE ${index + 1}</div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #111827; margin-bottom: 1.5rem; line-height: 1.3;">${q.question}</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;">A: ${q.options.A}</div>
                    <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;">B: ${q.options.B}</div>
                    <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;">C: ${q.options.C}</div>
                    <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px;">D: ${q.options.D}</div>
                </div>
                <div style="background-color: #f0fdf4; padding: 1rem; border-radius: 8px; font-weight: 800; color: #166534; margin-bottom: 1rem;">
                    KEY: ${q.answer}
                </div>
                <div style="background-color: #f8fafc; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
                    <span style="font-weight: 900; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Rational Discovery</span>
                    <p style="font-size: 0.95rem; color: #334155; margin-top: 0.5rem;">${q.explanation}</p>
                </div>
            </div>
        `;
    });
    
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 4rem; color: #1f2937; max-width: 800px; margin: 0 auto; }
                    h1 { font-size: 2.5rem; font-weight: 900; color: #111827; text-align: center; margin-bottom: 4rem; text-transform: uppercase; letter-spacing: -0.02em; }
                </style>
            </head>
            <body>
                <h1>Knowledge Lab Output</h1>
                ${quizHtml}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const formInputClass = "w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-sm font-bold placeholder:text-gray-400";
  const formLabelClass = "text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 block";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
            <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-gray-900">Knowledge Lab</span>
            </nav>
            <button 
                onClick={() => onNavigate('dashboard')}
                className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
            >
                <BackIcon />
                <span>Back to Dashboard</span>
            </button>
        </div>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                    Question <span className="text-blue-600">Lab.</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                    AI-powered synthesis of challenging multiple-choice questions tailored to your target examination.
                </p>
            </div>
            {quiz && (
                <button onClick={handleDownload} className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-sm uppercase tracking-widest whitespace-nowrap">
                    <DownloadIcon /> Export Assets
                </button>
            )}
        </header>

        <div className="bg-white rounded-[40px] border border-gray-100 shadow-lg p-8 md:p-12 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                    <label htmlFor="topic" className={formLabelClass}>Subject / Topic</label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className={formInputClass}
                        placeholder="e.g., Fundamental Rights, Ancient History"
                        required
                    />
                </div>
                <div className="md:col-span-4">
                    <label htmlFor="exam" className={formLabelClass}>Target Exam</label>
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
                    </select>
                </div>
                <div className="md:col-span-4">
                    <label htmlFor="difficulty" className={formLabelClass}>Difficulty Level</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['Easy', 'Medium', 'Hard']).map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setDifficulty(d)}
                                className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${difficulty === d ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-4">
                    <label htmlFor="count" className={formLabelClass}>Number of Questions</label>
                    <select
                        id="count"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className={formInputClass}
                        required
                    >
                        <option value={5}>05 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={25}>25 Questions</option>
                        <option value={50}>50 Questions</option>
                    </select>
                </div>
                <div className="md:col-span-4">
                    <button
                        type="submit"
                        disabled={isLoading || isRegenerating}
                        className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                </div>
            </form>
        </div>
      
        <div className="relative min-h-[400px]">
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader />
                    <h3 className="mt-8 text-2xl font-bold font-display text-gray-900">Generating Intelligence Batch...</h3>
                    <p className="text-gray-400 font-medium">Processing syllabus cross-references.</p>
                </div>
            )}
            {error && (
                <div className="text-center py-16 px-8 bg-red-50/50 border border-red-100 rounded-[40px] animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircleIcon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Synthesis Interrupted</h3>
                    <p className="text-gray-600 font-medium max-w-md mx-auto">{error}</p>
                    <button 
                        onClick={() => setError('')} 
                        className="mt-8 px-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                        Dismiss Analysis
                    </button>
                </div>
            )}
            {quiz && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <QuizDisplay 
                        quizData={quiz} 
                        onRegenerate={handleRegenerate} 
                        onDownload={handleDownload} 
                        isRegenerating={isRegenerating} 
                    />
                </div>
            )}
        </div>
    </div>
  );
};
