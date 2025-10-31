import React, { useState, FormEvent } from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Loader } from '../components/Loader';
import { AnswerDisplay } from '../components/AnswerDisplay';
import { generateStudyPlan, StudyPlanParams } from '../services/geminiService';

interface StudyPlannerPageProps {
  onNavigate: (page: Page) => void;
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

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({ onNavigate }) => {
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
    } catch (err) {
        setError('Failed to generate the study plan. Please try again later.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlan(''); // Clear previous plan on new submission
    await generatePlan();
  };

  const handleRefresh = async () => {
      await generatePlan();
  }

  const handleDownloadPlan = () => {
    if (!plan) return;

    const title = `Study Plan for ${formData.exam}`;
    const htmlContent = markdownToHtml(plan);
    const printWindow = window.open('', '_blank');
    
    printWindow?.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 2rem; color: #333; }
                    h1, h2, h3 { color: #000; }
                    strong { color: #0056b3; }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 1in; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <hr />
                ${htmlContent}
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
            <PlannerIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Study Planner</h1>
            <p className="text-gray-600 mt-1">Generate a personalized study schedule tailored to your goals.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="exam" className={formLabelClass}>Target Exam</label>
            <input
              type="text"
              id="exam"
              name="exam"
              value={formData.exam}
              onChange={handleInputChange}
              className={formInputClass}
              placeholder="e.g., UPSC, SSC CGL, IBPS PO"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="subjects" className={formLabelClass}>Subjects to Cover</label>
            <textarea
              id="subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              className={`${formInputClass} h-24 resize-y`}
              placeholder="e.g., History, Geography, Quantitative Aptitude"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className={formLabelClass}>Preparation Duration</label>
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
            <label htmlFor="dailyHours" className={formLabelClass}>Daily Study Hours</label>
            <input
              type="number"
              id="dailyHours"
              name="dailyHours"
              value={formData.dailyHours}
              onChange={handleInputChange}
              className={formInputClass}
              placeholder="e.g., 6"
              min="1"
              max="16"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? 'Generating Plan...' : 'Generate Study Plan'}
            </button>
          </div>
        </form>
      </div>
      
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8 relative">
        {isLoading && !plan && <Loader />}
        <AnswerDisplay 
            answer={plan} 
            title="Your Personalised Study Plan"
            onRefresh={plan ? handleRefresh : undefined}
            onDownload={plan ? handleDownloadPlan : undefined}
            isLoading={isLoading}
        />
      </div>
    </div>
  );
};