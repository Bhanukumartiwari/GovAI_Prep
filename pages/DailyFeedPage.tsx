import React, { useState, useEffect } from 'react';
import { Page } from '../App';
import { getDailyFeed, DailyFeedResponse, DailyFeedItem, getFactExpansion, FactExpansionResponse } from '../services/geminiService';
import { Loader } from '../components/Loader';
import { BackIcon } from '../components/icons/BackIcon';
import { RefreshIcon } from '../components/icons/RefreshIcon';
import { Newspaper, Book, Zap, Calendar, X, ExternalLink, Lightbulb } from 'lucide-react';

interface DailyFeedPageProps {
  onNavigate: (page: Page) => void;
  onAction?: (message: string, type?: string) => void;
}

export const DailyFeedPage: React.FC<DailyFeedPageProps> = ({ onNavigate, onAction }) => {
  const [feed, setFeed] = useState<DailyFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'Current Affairs' | 'Static GK'>('Current Affairs');
  
  // Fact Expansion State
  const [expandingFact, setExpandingFact] = useState<string | null>(null);
  const [factDetails, setFactDetails] = useState<FactExpansionResponse | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealedItems);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedItems(newRevealed);
  };

  const fetchFeed = async (force = false) => {
    setIsLoading(true);
    setError('');
    
    // Check local storage for today's feed (Version 3 for structure update)
    const cachedKey = `daily_feed_v3_${new Date().toDateString()}`;
    const cached = localStorage.getItem(cachedKey);
    
    if (cached && !force) {
      setFeed(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    try {
      const data = await getDailyFeed();
      setFeed(data);
      localStorage.setItem(cachedKey, JSON.stringify(data));
      if (onAction) onAction('Downloaded daily intelligence feed', 'intelligence');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Synchronization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandFact = async (fact: string) => {
    setExpandingFact(fact);
    setIsExpanding(true);
    setFactDetails(null);
    try {
      const data = await getFactExpansion(fact);
      setFactDetails(data);
      if (onAction) onAction(`Deep dived into: ${fact}`, 'success');
    } catch (err) {
      setError('Failed to expand fact. Please try again.');
    } finally {
      setIsExpanding(false);
    }
  };

  const closeExpansion = () => {
    setExpandingFact(null);
    setFactDetails(null);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-gray-900">Daily Intelligence</span>
        </nav>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
        >
          <BackIcon />
          <span>Exit Intel</span>
        </button>
      </div>

      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-6">
          <Zap className="w-3 h-3 fill-indigo-600" />
          Automated Daily Sync
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter font-display mb-4">
              The <span className="text-indigo-600">Daily 20.</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
              Your automated briefing of the top 10 Current Affairs and 10 Static GK facts curated specifically for UPSC, SSC, and Banking aspirants.
            </p>
          </div>
          <div className="flex items-center gap-3 py-4 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Briefing Date</p>
              <p className="text-sm font-black text-gray-900 leading-none">{today}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-20 z-40 bg-slate-50/80 backdrop-blur-md -mx-4 px-4 py-3 mb-10 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            {[
              { id: 'Current Affairs', icon: Newspaper, color: 'text-indigo-600' },
              { id: 'Static GK', icon: Book, color: 'text-emerald-600' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                {tab.id}
              </button>
            ))}
          </div>
          <button 
            onClick={() => fetchFeed(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-[10px] font-bold uppercase tracking-widest text-gray-400"
          >
            <RefreshIcon />
            <span>Force Sync</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader />
            <h3 className="mt-8 text-xl font-bold font-display text-gray-900 uppercase tracking-[0.2em]">Assembling Intel...</h3>
            <p className="text-gray-400 font-medium mt-2 text-sm">Gathering the world's most relevant facts for your success.</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 text-red-700 rounded-3xl border border-red-100">
            <Zap className="w-12 h-12 mx-auto mb-4 text-red-400 opacity-50" />
            <p className="text-lg font-bold">{error}</p>
            <button onClick={() => fetchFeed(true)} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 text-xs uppercase tracking-widest">Retry Sync</button>
          </div>
        ) : feed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(activeTab === 'Current Affairs' ? (feed.currentAffairs || []) : (feed.staticGk || [])).map((item, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-indigo-600"></span>
                  Node.{String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-display leading-tight group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="space-y-6 flex-grow">
                  <p className="text-sm text-gray-700 font-bold leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                    {item.summary || (item as any).content}
                  </p>

                  {!revealedItems.has(i) ? (
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => toggleReveal(i)}
                        className="w-full py-4 border-2 border-dashed border-indigo-100 rounded-2xl text-indigo-400 text-xs font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all bg-white"
                      >
                        Reveal Detailed Analysis
                      </button>
                      
                      {activeTab === 'Static GK' && (
                        <button 
                          onClick={() => handleExpandFact(item.title)}
                          className="w-full py-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Book className="w-3 h-3" />
                          Deep Dive Research
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                       <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Book className="w-3 h-3" />
                            Context & Analysis
                          </h4>
                          <div className="flex gap-4">
                            {activeTab === 'Static GK' && (
                               <button 
                                onClick={() => handleExpandFact(item.title)}
                                className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                              >
                                <Lightbulb className="w-2 h-2 fill-indigo-600" />
                                Deep Dive
                              </button>
                            )}
                            <button 
                              onClick={() => toggleReveal(i)}
                              className="text-[9px] font-black text-gray-300 hover:text-gray-900 uppercase tracking-widest"
                            >
                              Hide
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {item.context || (item as any).detailedExplanation}
                        </p>
                        {(item.significance || (item as any).significance) && (
                          <div className="mt-4 pt-4 border-t border-slate-200/50">
                            <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Zap className="w-3 h-3 fill-emerald-500" />
                              Significance
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {item.significance || (item as any).significance}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3 fill-indigo-400" />
                          Data Points & Must-Know Facts
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {(item.keyFacts || (item as any).importantFacts || []).map((fact, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => handleExpandFact(fact)}
                              className="flex items-start gap-3 text-left text-xs text-gray-600 font-semibold bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/fact active:scale-[0.98]"
                            >
                              <div className="mt-1 w-1 h-1 rounded-full bg-indigo-600 shrink-0 group-hover/fact:scale-150 transition-transform" />
                              <span className="flex-grow">{fact}</span>
                              <ExternalLink className="w-3 h-3 text-gray-300 opacity-0 group-hover/fact:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 bg-gray-50/30 -mx-8 -mb-8 px-8 pb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Exam Relevance</p>
                      <p className="text-[10px] font-bold text-gray-700 leading-tight italic">"{item.relevance}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fact Expansion Modal */}
      {expandingFact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeExpansion}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="absolute top-6 right-6 z-10">
              <button 
                onClick={closeExpansion}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-6">
                <Lightbulb className="w-3 h-3 fill-indigo-600" />
                Fact Deep Dive
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-display mb-8">
                {expandingFact}
              </h2>

              {isExpanding ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader />
                  <p className="mt-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Enriching Fact Data...</p>
                </div>
              ) : factDetails ? (
                <div className="space-y-8">
                  <div className="prose prose-sm prose-slate max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                      {factDetails.explanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        Quick Takeaways
                      </h3>
                      <ul className="space-y-3">
                        {factDetails.quickTakeaways.map((point, i) => (
                          <li key={i} className="flex gap-2 text-xs font-semibold text-emerald-800">
                            <span className="text-emerald-300">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Book className="w-3 h-3" />
                        Related Modules
                      </h3>
                      <ul className="space-y-3">
                        {factDetails.relatedArticles.map((article, i) => (
                          <li key={i} className="flex gap-2 text-xs font-semibold text-amber-800">
                            <span className="text-amber-300">•</span>
                            {article}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button 
                    onClick={closeExpansion}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
                  >
                    Return to Feed
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-red-500 font-bold">Failed to load expansion. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-4">End of Intelligence Briefing</p>
        <p className="text-sm text-gray-300 font-medium">Synced with World Events & Competitive Syllabus Databases.</p>
      </footer>
    </div>
  );
};
