import React, { useState } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';

export type Page = 'home' | 'dashboard' | 'tools' | 'current-affairs' | 'community' | 'contact' | 'study-planner' | 'mock-tests' | 'question-generator' | 'analytics' | 'exam-info' | 'document-analyzer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'tools':
        return <ToolsPage onNavigate={setCurrentPage} />;
      case 'current-affairs':
        return <CurrentAffairsPage onNavigate={setCurrentPage} />;
      case 'community':
        return <CommunityPage onNavigate={setCurrentPage} />;
      case 'contact':
        return <ContactPage onNavigate={setCurrentPage} />;
      case 'study-planner':
        return <StudyPlannerPage onNavigate={setCurrentPage} />;
      case 'mock-tests':
        return <MockTestsPage onNavigate={setCurrentPage} />;
      case 'question-generator':
        return <QuestionGeneratorPage onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={setCurrentPage} />;
      case 'exam-info':
        return <ExamInfoPage onNavigate={setCurrentPage} />;
      case 'document-analyzer':
        return <DocumentAnalyzerPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
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
