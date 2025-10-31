import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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

export type Page = 'home' | 'dashboard' | 'tools' | 'current-affairs' | 'community' | 'contact' | 'study-planner' | 'mock-tests' | 'question-generator' | 'analytics' | 'exam-info';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'tools':
        return <ToolsPage onNavigate={setCurrentPage} />;
      case 'current-affairs':
        return <CurrentAffairsPage />;
      case 'community':
        return <CommunityPage />;
      case 'contact':
        return <ContactPage />;
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
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;