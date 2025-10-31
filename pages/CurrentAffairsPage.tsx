import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { NewsIcon } from '../components/icons/NewsIcon';
import { getCurrentAffairs, NewsItem } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { RefreshIcon } from '../components/icons/RefreshIcon';

export const CurrentAffairsPage: React.FC = () => {
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
    
    const formInputClass = "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <button onClick={handleRegenerate} disabled={isRegenerating} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
                                {isRegenerating ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : <RefreshIcon />}
                                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                            </button>
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
                                    <p className="text-gray-600 mt-3">{item.summary}</p>
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