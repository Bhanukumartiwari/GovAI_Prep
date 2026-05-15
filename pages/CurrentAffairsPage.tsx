import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { Page } from '../App';
import { NewsIcon } from '../components/icons/NewsIcon';
import { getCurrentAffairs, NewsItem } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Send, Share2 } from 'lucide-react';
import { shareContent } from '../lib/exportUtils';

interface CurrentAffairsPageProps {
    onNavigate: (page: Page) => void;
    onAction?: (message: string, type?: string) => void;
}

export const CurrentAffairsPage: React.FC<CurrentAffairsPageProps> = ({ onNavigate, onAction }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [exam, setExam] = useState('All Exams');
    const [activeSearch, setActiveSearch] = useState('Latest National News');
    const [activeDate, setActiveDate] = useState('');
    const [activeToDate, setActiveToDate] = useState('');
    const [activeExam, setActiveExam] = useState('All Exams');
    const [isLoading, setIsLoading] = useState(true);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState('');

    const fetchNews = useCallback(async (topic: string, searchDate?: string, examFilter?: string, searchToDate?: string) => {
        setError('');
        try {
            const dateRange = searchToDate ? `${searchDate} to ${searchToDate}` : searchDate;
            const data = await getCurrentAffairs(topic, dateRange, examFilter);
            setNewsItems(data.articles);
            if (onAction && topic !== 'Latest National News') {
                onAction(`Searched current affairs for "${topic}"`, 'news');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setNewsItems([]);
        }
    }, [onAction]);

    useEffect(() => {
        const loadInitialNews = async () => {
            setIsLoading(true);
            await fetchNews(activeSearch, activeDate, activeExam, activeToDate);
            setIsLoading(false);
        };
        loadInitialNews();
    }, [activeSearch, activeDate, activeExam, activeToDate, fetchNews]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        let newSearch = searchQuery.trim();
        if (!newSearch) {
            newSearch = 'Latest National News';
        }
        setActiveSearch(newSearch);
        setActiveDate(date);
        setActiveToDate(toDate);
        setActiveExam(exam);
    };

    const handleReset = () => {
        setSearchQuery('');
        setDate('');
        setToDate('');
        setExam('All Exams');
        setActiveSearch('Latest National News');
        setActiveDate('');
        setActiveToDate('');
        setActiveExam('All Exams');
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        await fetchNews(activeSearch, activeDate, activeExam, activeToDate);
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

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-4">
                        Daily <span className="text-blue-600">Briefing.</span>
                    </h1>
                    <p className="text-base text-gray-500 font-medium leading-relaxed">
                        Curated intelligence report mapping global events to your specific exam syllabus.
                    </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <button 
                        onClick={() => {
                            const text = `*Intelligence Report: ${activeSearch}*\n\nCurated insights for government exam prep.\n\nRead more at Prep AI`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                    >
                        <Send className="w-4 h-4" /> WhatsApp
                    </button>
                    <button onClick={handleDownloadReport} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap">
                        <DownloadIcon /> Export
                    </button>
                    <button 
                        onClick={() => shareContent(`Briefing: ${activeSearch}`, `Check out this current affairs intelligence report on Prep AI.`)}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 border border-blue-100 font-bold rounded-xl hover:bg-blue-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest whitespace-nowrap"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl -mx-4 px-4 py-4 mb-10 border-b border-gray-100 shadow-sm transition-all duration-300">
                <form onSubmit={handleSearch} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3 relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Search Intelligence</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Topic (e.g. Lithium Reserves)..."
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-xs font-bold placeholder:text-gray-300 uppercase tracking-widest pl-10"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">From</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-xs font-bold uppercase tracking-widest text-gray-900"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">To</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-xs font-bold uppercase tracking-widest text-gray-900"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Focus</label>
                        <select
                            value={exam}
                            onChange={(e) => setExam(e.target.value)}
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-xs font-bold uppercase tracking-widest appearance-none cursor-pointer"
                        >
                            <option>All Exams</option>
                            <option>UPSC</option>
                            <option>SSC</option>
                            <option>Banking</option>
                        </select>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                         <button
                            type="submit"
                            className="flex-grow py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            Sync Intelligence
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-3.5 bg-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 text-[10px]"
                            title="Reset Search"
                        >
                             <RefreshIcon />
                        </button>
                    </div>
                </form>
            </div>

            <div className="relative min-h-[600px]">
                {(activeSearch !== 'Latest National News' || activeDate || activeToDate || activeExam !== 'All Exams') && !isLoading && (
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Results for: <span className="text-blue-600">"{activeSearch === 'Latest National News' ? 'Recent Events' : activeSearch}"</span>
                        </h2>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Found {newsItems.length} Intelligence Reports
                        </div>
                    </div>
                )}
                {isLoading && !isRegenerating ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader />
                        <h3 className="mt-6 text-xl font-bold font-display text-gray-900 uppercase tracking-widest">Synchronizing...</h3>
                        <p className="text-gray-400 font-medium mt-2 text-sm">Connecting to world news intelligence desk.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {newsItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 p-8 group">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/4">
                                        <div className="sticky top-44">
                                            <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                                <span className="w-4 h-0.5 bg-blue-600"></span>
                                                {item.category}
                                            </div>
                                            <div className="text-2xl font-black text-gray-100 group-hover:text-gray-200 transition-colors pointer-events-none mb-4">
                                                {item.date}
                                            </div>
                                            <div className="hidden md:flex flex-col gap-2">
                                                <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600/20 w-3/4"></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Priority: High</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-3/4">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-display leading-tight group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-base text-gray-500 font-medium mb-6 leading-relaxed">
                                            {item.summary}
                                        </p>
                                        
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Strategic Analysis</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                    {item.detailedAnalysis}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-50 self-start relative group/card">
                                                <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">Exam Focus</h4>
                                                <p className="text-xs text-blue-900 font-bold italic leading-relaxed mb-4">
                                                    "{item.examRelevance}"
                                                </p>
                                                <div className="flex gap-2 justify-end">
                                                    <button 
                                                        onClick={() => {
                                                            const text = `*Current Affairs: ${item.title}*\n\nAnalysis: ${item.summary}\n\nRead more at Prep AI`;
                                                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                                                        }}
                                                        className="p-1.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="WhatsApp"
                                                    >
                                                        <Send className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => shareContent(item.title, item.summary)}
                                                        className="p-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        title="Share"
                                                    >
                                                        <Share2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-20 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                        <p className="text-lg font-bold">{error}</p>
                        <button onClick={handleRegenerate} className="mt-5 px-7 py-3 bg-red-600 text-white rounded-lg font-bold shadow-md shadow-red-200 text-xs">Retry Sync</button>
                    </div>
                )}
            </div>
        </div>
    );
};
