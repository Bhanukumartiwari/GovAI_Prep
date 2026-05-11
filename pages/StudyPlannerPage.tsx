import React, { useState, FormEvent } from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Loader } from '../components/Loader';
import { AnswerDisplay } from '../components/AnswerDisplay';
import { generateStudyPlan, StudyPlanParams } from '../services/geminiService';

interface StudyPlannerPageProps {
  onNavigate: (page: Page) => void;
  onAction?: (message: string, type?: string) => void;
}

// Helper to convert simple markdown to HTML for printing
const markdownToHtml = (text: string): string => {
    if (!text) return '';
    return text
        .replace(/# (.*?)\n/g, '<h1>$1</h1>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
};

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({ onNavigate, onAction }) => {
  const [formData, setFormData] = useState<StudyPlanParams>({
    exam: 'UPSC Civil Services',
    subjects: 'History, Geography, Polity, Economy, Science & Tech, Current Affairs',
    duration: '6 Months',
    dailyHours: '6',
  });
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePlan = async () => {
    if (!formData.exam || !formData.subjects || !formData.duration || !formData.dailyHours) {
        setError('Please fill in all fields.');
        return;
    }

    setIsLoading(true);
    setError('');
    
    try {
        const result = await generateStudyPlan(formData);
        setPlan(result);
        if (onAction) {
          onAction(`Updated study plan for ${formData.exam}`, 'planner');
        }
    } catch (err: any) {
        setError(err?.message || 'Failed to generate the study plan. Please try again later.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlan(''); 
    await generatePlan();
  };

  const handleRefresh = async () => {
      await generatePlan();
  }

  const handleDownloadPlan = () => {
    if (!plan) return;

    const title = `Study Plan: ${formData.exam}`;
    const printWindow = window.open('', '_blank');
    
    printWindow?.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 3rem; color: #1f2937; max-width: 800px; margin: 0 auto; }
                    h1 { font-size: 2.5rem; font-weight: 800; color: #111827; margin-bottom: 2rem; border-bottom: 4px solid #3b82f6; padding-bottom: 1rem; }
                    h2 { font-size: 1.8rem; font-weight: 700; color: #1f2937; margin-top: 2rem; }
                    h3 { font-size: 1.3rem; font-weight: 600; color: #374151; }
                    p { margin-bottom: 1rem; }
                    strong { color: #1d4ed8; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="content">${plan.replace(/\n/g, '<br/>')}</div>
            </body>
        </html>
    `);

    printWindow?.document.close();
    printWindow?.focus();
    setTimeout(() => printWindow?.print(), 500);
  };

  const formInputClass = "w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-lg font-medium";
  const formLabelClass = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
          <span className="mx-3 opacity-30">/</span>
          <button onClick={() => onNavigate('tools')} className="hover:text-blue-600 transition-colors">Tools</button>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-gray-900">AI Study Planner</span>
        </nav>
        <button 
                onClick={() => onNavigate('tools')}
                className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
            >
                <BackIcon />
                <span>Back to Tools</span>
            </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
            <div className="sticky top-28">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center text-white mb-8">
                    <PlannerIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                    Our Weekly <br />
                    <span className="text-blue-600 italic">Study Plan.</span>
                </h1>
                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
                    Get a personalized week-by-week strategy tailored to your subjects and daily commitment for maximum memory retention.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12"></div>
                    
                    <div className="relative z-10 space-y-6">
                        <div>
                            <label htmlFor="exam" className={formLabelClass}>Target Exam</label>
                            <input
                                type="text"
                                id="exam"
                                name="exam"
                                value={formData.exam}
                                onChange={handleInputChange}
                                className={formInputClass}
                                placeholder="e.g. UPSC Prelims 2024"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subjects" className={formLabelClass}>Syllabus Core</label>
                            <textarea
                                id="subjects"
                                name="subjects"
                                value={formData.subjects}
                                onChange={handleInputChange}
                                className={`${formInputClass} h-32 resize-none`}
                                placeholder="List your key subjects..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="duration" className={formLabelClass}>Timeline</label>
                                <select
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className={formInputClass}
                                    required
                                >
                                    <option>1 Month</option>
                                    <option>3 Months</option>
                                    <option>6 Months</option>
                                    <option>1 Year</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dailyHours" className={formLabelClass}>Daily Hours</label>
                                <input
                                    type="number"
                                    id="dailyHours"
                                    name="dailyHours"
                                    value={formData.dailyHours}
                                    onChange={handleInputChange}
                                    className={formInputClass}
                                    placeholder="6"
                                    min="1"
                                    max="16"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Generating Strategy...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate Study Plan</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div className="lg:col-span-3">
             {error && (
                <div className="mb-8 p-6 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-2xl font-bold animate-pulse">
                    {error}
                </div>
            )}
            
            <div className="relative">
                {isLoading && !plan ? (
                    <div className="bg-white p-20 rounded-[40px] shadow-xl border border-gray-50 flex flex-col items-center justify-center text-center">
                        <Loader />
                        <h3 className="mt-8 text-2xl font-bold text-gray-900 font-display">Crafting your roadmap...</h3>
                        <p className="text-gray-500 mt-2 font-medium">Analyzing exam notification and subject dependencies.</p>
                    </div>
                ) : (
                    <AnswerDisplay 
                        answer={plan || "### Your study plan will appear here\nFill out the form on the left to generate a comprehensive, AI-powered study schedule for your target exam."} 
                        title={plan ? `${formData.exam} - Master Plan` : "Roadmap Preview"}
                        onRefresh={plan ? handleRefresh : undefined}
                        onDownload={plan ? handleDownloadPlan : undefined}
                        isLoading={isLoading}
                    />
                )}
            </div>
            
            {!plan && !isLoading && (
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 text-lg">📈</div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Adaptive Logic</h4>
                            <p className="text-sm text-blue-700/80 leading-relaxed">Plans adjust difficulty based on your subject familiarity and available hours.</p>
                        </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex gap-4 items-start">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 text-lg">🎯</div>
                        <div>
                            <h4 className="font-bold text-green-900 mb-1">Weekly Milestones</h4>
                            <p className="text-sm text-green-700/80 leading-relaxed">Breaks down massive syllabi into bite-sized, achievable weekly targets.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
