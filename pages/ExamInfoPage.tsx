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

  const fetchInfo = async () => {
    if (!exam.trim()) {
      setError('Please select or enter an exam name.');
      return;
    }

    setIsLoading(true);
    setError('');
    setInfo('');

    try {
      const result = await getExamInfo(exam);
      setInfo(result);
    } catch (err) {
      setError('Failed to fetch exam information. Please try again later.');
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

    const title = `Exam Information for ${exam}`;
    const htmlContent = markdownToHtml(info);
    
    const printWindow = window.open('', '_blank');
    
    printWindow?.document.write(`
        <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 2rem; color: #333; }
                    h1, h2, h3 { color: #000; }
                    strong { color: #0056b3; }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
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
            <InfoIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Exam Information Center</h1>
            <p className="text-gray-600 mt-1">Get details on exam dates, patterns, and syllabus.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="md:col-span-2">
              <label htmlFor="exam-input" className={formLabelClass}>Select or Enter Exam Name</label>
              <input
                list="exams"
                id="exam-input"
                name="exam"
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className={formInputClass}
                placeholder="e.g., UPSC Civil Services"
                required
              />
              <datalist id="exams">
                {popularExams.map(ex => <option key={ex} value={ex} />)}
              </datalist>
            </div>
            <div className="md:col-span-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isLoading ? 'Fetching...' : 'Get Info'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      <div className="mt-8 relative">
        {isLoading && !info && <Loader />}
        <AnswerDisplay 
            answer={info} 
            title={info ? `Information for ${exam}` : 'AI Generated Answer'}
            onRefresh={info ? handleRefresh : undefined}
            onDownload={info ? handleDownload : undefined}
            isLoading={isLoading}
        />
      </div>
    </div>
  );
};
