import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { Page } from '../App';
import { NewsIcon } from '../components/icons/NewsIcon';
import { getCurrentAffairs, NewsItem } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { BackIcon } from '../components/icons/BackIcon';

interface CurrentAffairsPageProps {
    onNavigate: (page: Page) => void;
}

export const CurrentAffairsPage: React.FC<CurrentAffairsPageProps> = ({ onNavigate }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [exam, setExam] = useState('All Exams');
    const [activeSearch, setActiveSearch] = useState('Latest National News');
    const [activeDate, setActiveDate] = useState('');
    const [activeExam, setActiveExam] = useState('All Exams');
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState('');

    const fetchNews = useCallback(async (topic: string, searchDate?: string, examFilter?: string) => {
        setError('');
        try {
            const data = await getCurrentAffairs(topic, searchDate, examFilter);
            setNewsItems(data.articles);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setNewsItems([]);
        }
    }, []);

    useEffect(() => {
        const loadInitialNews = async () => {
            setIsLoading(true);
            await fetchNews(activeSearch, activeDate, activeExam);
            setIsLoading(false);
        };
        loadInitialNews();
    }, [activeSearch, activeDate, activeExam, fetchNews]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        let newSearch = searchQuery.trim();
        if (!newSearch && (date || exam !== 'All Exams')) {
            newSearch = 'Latest National News';
        } else if (!newSearch && !date && exam === 'All Exams') {
            newSearch = 'Latest National News';
        }
        setActiveSearch(newSearch);
        setActiveDate(date);
        setActiveExam(exam);
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        await fetchNews(activeSearch, activeDate, activeExam);
        setIsRegenerating(false);
    }

    const handleDownloadReport = () => {
        if (newsItems.length === 0) return;

        const title = `Current Affairs Report: ${activeSearch}`;
        let reportHtml = '';

        newsItems.forEach((item, index) => {
            reportHtml += `
                <div style="margin-bottom: 2rem; border-bottom: 2px solid #edf2f7; padding-bottom: 1.5rem;">
                    <div style="display: flex; justify-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="background: #ebf8ff; color: #2b6cb0; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: bold;">${item.category}</span>
                        <span style="color: #718096; font-size: 0.75rem; margin-left: auto;">${item.date}</span>
                    </div>
                    <h3 style="margin: 0.5rem 0; color: #1a202c; font-size: 1.25rem;">${item.title}</h3>
                    <p style="color: #4a5568; font-weight: 500; margin-bottom: 1rem;">${item.summary}</p>
                    <div style="margin-top: 1rem;">
                        <h4 style="font-size: 0.75rem; color: #a0aec0; text-transform: uppercase; margin-bottom: 0.25rem;">Detailed Analysis</h4>
                        <p style="font-size: 0.9rem; color: #2d3748; line-height: 1.6;">${item.detailedAnalysis}</p>
                    </div>
                    <div style="margin-top: 1rem; background: #f0f9ff; padding: 0.75rem; border-left: 4px solid #4299e1;">
                        <h4 style="font-size: 0.75rem; color: #2b6cb0; text-transform: uppercase; margin-bottom: 0.25rem;">Exam Relevance</h4>
                        <p style="font-size: 0.85rem; color: #2c5282; font-style: italic;">${item.examRelevance}</p>
                    </div>
                </div>
            `;
        });

        const printWindow = window.open('', '_blank');
        printWindow?.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; padding: 2rem; color: #1a202c; max-width: 800px; margin: 0 auto; }
                        h1 { text-align: center; color: #2d3748; margin-bottom: 2rem; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 1in; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <p style="text-align: center; color: #718096; margin-bottom: 2rem;">Generated by GovAI Prep - ${new Date().toLocaleDateString()}</p>
                    <hr style="border: 0; border-top: 2px solid #e2e8f0; margin-bottom: 2rem;" />
                    ${reportHtml}
                </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
    };

    const formInputClass = "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('tools')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Tools
            </button>
            <div className="flex items-center gap-4 mb-4">
                <NewsIcon />
                <h1 className="text-4xl font-bold text-gray-900">Latest Current Affairs</h1>
            </div>
            <p className="text-lg text-gray-600 mb-6">Stay updated with the most important news relevant to your exam preparation.</p>

            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="search-query" className="sr-only">Search Topic</label>
                    <input
                        id="search-query"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search topics like 'Indian Economy'..."
                        className={`w-full ${formInputClass}`}
                        aria-label="Search current affairs topic"
                    />
                </div>
                 <div>
                    <label htmlFor="exam-filter" className="sr-only">Exam Filter</label>
                    <select
                        id="exam-filter"
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                        className={`w-full ${formInputClass}`}
                    >
                        <option>All Exams</option>
                        <option>UPSC</option>
                        <option>SSC</option>
                        <option>Banking</option>
                        <option>Railways</option>
                    </select>
                 </div>
                 <div>
                    <label htmlFor="date-filter" className="sr-only">Date</label>
                    <input
                        id="date-filter"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full ${formInputClass}`}
                        aria-label="Select date for current affairs"
                    />
                </div>
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                    >
                        {isLoading && !isRegenerating ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            <div className="relative min-h-[400px]">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg">
                        <p>{error}</p>
                    </div>
                ) : newsItems.length > 0 ? (
                    <div>
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                Showing results for "{activeSearch}"
                                {activeExam !== 'All Exams' && ` (${activeExam})`}
                                {activeDate && ` around ${activeDate}`}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={handleDownloadReport} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                                    <DownloadIcon /> Report
                                </button>
                                <button onClick={handleRegenerate} disabled={isRegenerating} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    {isRegenerating ? (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : <RefreshIcon />}
                                    {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {newsItems.map((item, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex justify-between items-start flex-wrap gap-y-2">
                                        <div>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{item.category}</span>
                                            <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
                                        </div>
                                        <span className="text-sm text-gray-500 flex-shrink-0 ml-4">{item.date}</span>
                                    </div>
                                    <p className="text-gray-600 mt-3 font-medium">{item.summary}</p>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detailed Analysis</h4>
                                            <p className="text-gray-700 text-sm leading-relaxed">{item.detailedAnalysis}</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Exam Relevance</h4>
                                            <p className="text-blue-700 text-sm italic">{item.examRelevance}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                     <div className="text-center py-10 bg-gray-50 text-gray-500 rounded-lg">
                        <p>No current affairs found for "{activeSearch}"{activeDate && ` on ${activeDate}`}. Try another topic or date.</p>
                    </div>
                )}
            </div>
        </div>
    );
};