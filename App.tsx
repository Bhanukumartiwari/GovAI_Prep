import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdsterraBannerOne, AdsterraBannerTwo } from './components/AdsterraAds';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { CurrentAffairsPage } from './pages/CurrentAffairsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { QuestionGeneratorPage } from './pages/QuestionGeneratorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExamInfoPage } from './pages/ExamInfoPage';
import { DocumentAnalyzerPage } from './pages/DocumentAnalyzerPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { motion, AnimatePresence } from 'motion/react';

export type Page = 'home' | 'dashboard' | 'tools' | 'current-affairs' | 'community' | 'contact' | 'study-planner' | 'mock-tests' | 'question-generator' | 'analytics' | 'exam-info' | 'document-analyzer' | 'blog' | 'blog-post';

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('user_activities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_activities', JSON.stringify(activities));
  }, [activities]);

  const handleNavigate = (page: Page, slug?: string) => {
    setCurrentPage(page);
    if (slug) {
        setSelectedSlug(slug);
    }
  };

  const addActivity = (message: string, type: string = 'action') => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 5));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} activities={activities} />;
      case 'tools':
        return <ToolsPage onNavigate={handleNavigate} />;
      case 'current-affairs':
        return <CurrentAffairsPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'community':
        return <CommunityPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'study-planner':
        return <StudyPlannerPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'mock-tests':
        return <MockTestsPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'question-generator':
        return <QuestionGeneratorPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={handleNavigate} />;
      case 'exam-info':
        return <ExamInfoPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'document-analyzer':
        return <DocumentAnalyzerPage onNavigate={handleNavigate} onAction={addActivity} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'blog-post':
        return <BlogPostPage onNavigate={handleNavigate} slug={selectedSlug || ''} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow pt-4">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="w-full h-full"
            >
                {renderPage()}
            </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentPage} />
      <div className="container mx-auto px-4 pb-8">
        <AdsterraBannerOne />
        <AdsterraBannerTwo />
      </div>
    </div>
  );
};

export default App;
