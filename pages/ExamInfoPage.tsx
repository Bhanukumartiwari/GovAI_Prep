import React, { useState, FormEvent } from 'react';
import { Page } from '../App';
import { InfoIcon } from '../components/icons/InfoIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Loader } from '../components/Loader';
import { AnswerDisplay } from '../components/AnswerDisplay';
import { getExamInfo } from '../services/geminiService';

interface ExamInfoPageProps {
  onNavigate: (page: Page) => void;
}

const popularExams = [
  'UPSC Civil Services',
  'SSC CGL',
  'IBPS PO',
  'RRB NTPC',
  'SBI PO',
  'CAT',
  'GATE'
];

// Helper to convert simple markdown to HTML for printing
const markdownToHtml = (text: string): string => {
    if (!text) return '';
    // This is a simplified parser. A more robust library could be used for complex markdown.
    return text
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
};

export const ExamInfoPage: React.FC<ExamInfoPageProps> = ({ onNavigate }) => {
  const [exam, setExam] = useState('UPSC Civil Services');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInfo = async (examName?: string) => {
    const targetExam = examName || exam;
    if (!targetExam.trim()) {
      setError('Check selection parameters.');
      return;
    }

    if (examName) setExam(examName);
    setIsLoading(true);
    setError('');
    setInfo('');

    try {
      const result = await getExamInfo(targetExam);
      setInfo(result);
    } catch (err: any) {
      setError(err?.message || 'Intelligence retrieval failed. System retry recommended.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchInfo();
  };

  const handleRefresh = async () => {
    await fetchInfo();
  }
  
  const handleDownload = () => {
    if (!info) return;

    const title = `Intelligence Dossier: ${exam}`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 4rem; color: #1f2937; max-width: 800px; margin: 0 auto; }
                    h1 { font-size: 2.5rem; font-weight: 900; color: #111827; text-align: center; margin-bottom: 4rem; text-transform: uppercase; letter-spacing: -0.02em; }
                    h2 { font-size: 1.5rem; font-weight: 800; color: #1f2937; border-bottom: 3px solid #3b82f6; display: inline-block; padding-bottom: 4px; margin-top: 3rem; margin-bottom: 1.5rem; }
                    h3 { font-size: 1.1rem; font-weight: 700; color: #374151; margin-top: 2rem; margin-bottom: 1rem; }
                    p { margin-bottom: 1rem; color: #4b5563; }
                    strong { color: #111827; }
                    @media print { body { padding: 0; } @page { margin: 1in; } }
                </style>
            </head>
            <body>
                <h1>Exam Intelligence Dossier</h1>
                <div style="background: #f8fafc; padding: 2rem; border-radius: 12px; margin-bottom: 3rem; text-align: center; border: 1px solid #e2e8f0;">
                    <span style="font-size: 0.7rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 0.5rem;">Subject Profile</span>
                    <span style="font-size: 1.5rem; font-weight: 900; color: #3b82f6;">${exam}</span>
                </div>
                <div class="content">${markdownToHtml(info)}</div>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const formInputClass = "w-full p-5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-sm font-bold placeholder:text-gray-400 appearance-none";
  const formLabelClass = "text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
            <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-gray-900">Information Lab</span>
            </nav>
            <button 
                onClick={() => onNavigate('dashboard')}
                className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
            >
                <BackIcon />
                <span>Return to Command</span>
            </button>
        </div>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-4">
                    Exam <span className="text-blue-600">Protocol.</span>
                </h1>
                <p className="text-base text-gray-500 font-medium leading-relaxed">
                    Accessing centralized intelligence archives for competitive examinations.
                </p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Control Panel */}
            <div className="lg:col-span-4">
                <div className="bg-gray-900 rounded-2xl p-7 md:p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    
                    <form onSubmit={handleSubmit} className="relative z-10">
                        <div className="mb-6">
                            <label htmlFor="exam-input" className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-4 block">Archive Directory</label>
                            <input
                                list="exams"
                                id="exam-input"
                                name="exam"
                                value={exam}
                                onChange={(e) => setExam(e.target.value)}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-xs font-bold placeholder:text-gray-500 appearance-none uppercase tracking-widest"
                                placeholder="Search exams..."
                                required
                            />
                            <datalist id="exams">
                                {popularExams.map(ex => <option key={ex} value={ex} />)}
                            </datalist>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl shadow-lg hover:bg-blue-500 hover:text-white transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-[0.2em]"
                        >
                            {isLoading ? 'Querying...' : 'Fetch Intelligence'}
                        </button>
                    </form>

                    <div className="mt-10">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-5 block">Quick Access</label>
                        <div className="grid grid-cols-1 gap-2">
                            {popularExams.slice(0, 6).map((ex) => (
                                <button
                                    key={ex}
                                    onClick={() => fetchInfo(ex)}
                                    className={`text-left p-3.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${exam === ex ? 'bg-blue-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
                {isLoading && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                        <Loader />
                        <h3 className="mt-6 text-xl font-bold font-display text-gray-900 uppercase tracking-widest">Synchronizing...</h3>
                        <p className="text-gray-400 font-medium text-sm mt-2">Accessing official archives and synthesizing intelligence.</p>
                    </div>
                )}

                {!isLoading && !info && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Pattern Lab', desc: 'Detailed breakdown of examination structures and marking schemes.', icon: '01' },
                            { title: 'Syllabus Map', desc: 'Every topic categorized by priority and exam frequency.', icon: '02' },
                            { title: 'Timeline', desc: 'Projected dates and notification cycles synchronized via AI.', icon: '03' },
                            { title: 'Strategy', desc: 'Subject-wise preparation blueprints for optimal scoring.', icon: '04' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                                <div className="text-3xl font-bold text-gray-100 group-hover:text-blue-50 text-right mb-2 transition-colors font-display tracking-tighter">{feature.icon}</div>
                                <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">{feature.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {info && !isLoading && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <AnswerDisplay 
                            answer={info} 
                            title={`${exam} IntelligenceReport`}
                            onRefresh={handleRefresh}
                            onDownload={handleDownload}
                        />
                    </div>
                )}
            </div>
        </div>

        {error && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                <button onClick={() => setError('')} className="ml-4 opacity-50 hover:opacity-100">✕</button>
            </div>
        )}
    </div>
  );
};
