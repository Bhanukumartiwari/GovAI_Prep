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

        const title = `Briefing: ${activeSearch}`;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let reportHtml = '';
        newsItems.forEach((item) => {
            reportHtml += `
                <div style="margin-bottom: 3rem; page-break-inside: avoid;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; margin-bottom: 1rem;">
                        <span>${item.category}</span>
                        <span>${item.date}</span>
                    </div>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin-bottom: 1rem; line-height: 1.2;">${item.title}</h2>
                    <p style="font-weight: 600; color: #374151; margin-bottom: 1.5rem;">${item.summary}</p>
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="font-size: 0.7rem; font-weight: 900; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Strategic Analysis</h3>
                        <p style="font-size: 0.95rem; color: #4b5563; line-height: 1.6;">${item.detailedAnalysis}</p>
                    </div>
                    <div style="background: #eff6ff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #2563eb;">
                        <h3 style="font-size: 0.7rem; font-weight: 900; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Syllabus Integration</h3>
                        <p style="font-size: 0.9rem; color: #1e40af; font-style: italic;">${item.examRelevance}</p>
                    </div>
                </div>
            `;
        });

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
                        body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 4rem; color: #1f2937; max-width: 800px; margin: 0 auto; }
                        h1 { font-size: 3rem; font-weight: 900; color: #111827; letter-spacing: -0.02em; margin-bottom: 0.5rem; text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>The Daily Brief</h1>
                    <p style="text-align: center; color: #9ca3af; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 4rem;">Intelligence Report | ${new Date().toLocaleDateString()}</p>
                    ${reportHtml}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
    };

    const formInputClass = "w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-sm font-bold placeholder:text-gray-400";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
            <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-gray-900">Briefing Room</span>
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
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                        Daily <span className="text-blue-600">Briefing.</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        Curated intelligence report mapping global events to your specific exam syllabus.
                    </p>
                </div>
                <button onClick={handleDownloadReport} className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-sm uppercase tracking-widest whitespace-nowrap">
                    <DownloadIcon /> Export Intelligence
                </button>
            </header>

            <div className="sticky top-20 z-40 bg-[#FBFCFD]/80 backdrop-blur-md -mx-4 px-4 py-4 mb-12 border-b border-gray-100">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by topic (e.g. Finance Commission)..."
                            className={formInputClass}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={exam}
                            onChange={(e) => setExam(e.target.value)}
                            className={formInputClass}
                        >
                            <option>All Exams</option>
                            <option>UPSC</option>
                            <option>SSC</option>
                            <option>Banking</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                         <button
                            type="submit"
                            className="w-full h-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]"
                        >
                            Update Feed
                        </button>
                    </div>
                </form>
            </div>

            <div className="relative min-h-[600px]">
                {isLoading && !isRegenerating ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader />
                        <h3 className="mt-8 text-2xl font-bold font-display text-gray-900">Synchronizing Feed...</h3>
                        <p className="text-gray-400 font-medium mt-2">Connecting to world news intelligence desk.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {newsItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 p-8 md:p-12 group">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/4">
                                        <div className="sticky top-44">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                                <span className="w-4 h-0.5 bg-blue-600"></span>
                                                {item.category}
                                            </div>
                                            <div className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors pointer-events-none mb-4">
                                                {item.date}
                                            </div>
                                            <div className="hidden md:flex flex-col gap-2">
                                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600/20 w-3/4"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relevance: High</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-3/4">
                                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 font-display leading-tight group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xl text-gray-500 font-semibold mb-8 leading-relaxed">
                                            {item.summary}
                                        </p>
                                        
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">In-Depth Analysis</h4>
                                                <p className="text-gray-600 leading-relaxed font-medium">
                                                    {item.detailedAnalysis}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 self-start">
                                                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Strategic Relevance</h4>
                                                <p className="text-sm text-blue-900 font-bold italic leading-relaxed">
                                                    "{item.examRelevance}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-20 bg-red-50 text-red-700 rounded-[40px] border border-red-100">
                        <p className="text-xl font-bold">{error}</p>
                        <button onClick={handleRegenerate} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200">Retry Manual Sync</button>
                    </div>
                )}
            </div>
        </div>
    );
};
