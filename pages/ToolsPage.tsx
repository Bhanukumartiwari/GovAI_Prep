import React from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { SimulatorIcon } from '../components/icons/SimulatorIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import { InfoIcon } from '../components/icons/InfoIcon';
import { BackIcon } from '../components/icons/BackIcon';

interface ToolsPageProps {
    onNavigate: (page: Page) => void;
}

const tools = [
    {
        icon: <PlannerIcon />,
        title: "AI Study Planner",
        description: "Generate a personalized study schedule tailored to your goals and timeline.",
        page: 'study-planner' as Page,
    },
    {
        icon: <GeneratorIcon />,
        title: "Question Generator",
        description: "Create custom quizzes and practice tests on any topic from the syllabus.",
        page: 'question-generator' as Page,
    },
    {
        icon: <SimulatorIcon />,
        title: "Mock Test Simulator",
        description: "Take full-length mock tests in an exam-like environment.",
        page: 'mock-tests' as Page,
    },
    {
        icon: <AnalyticsIcon />,
        title: "Performance Analytics",
        description: "Analyze your strengths and weaknesses with detailed performance reports.",
        page: 'analytics' as Page,
    },
    {
        icon: <InfoIcon />,
        title: "Exam Information",
        description: "Get details on exam dates, patterns, and syllabus for major government exams.",
        page: 'exam-info' as Page,
    },
    {
        icon: (
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: "Document AI Analyzer",
        description: "Upload PDFs or notes to get smart summaries and auto-generated practice questions.",
        page: 'document-analyzer' as Page,
    }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-[#FBFCFD] min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
                <div className="flex items-center justify-between mb-12">
                    <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                        <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                        <span className="mx-3 opacity-30">/</span>
                        <span className="text-gray-900">Preparation Tools</span>
                    </nav>
                    <button 
                        onClick={() => onNavigate('dashboard')}
                        className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                    >
                        <BackIcon />
                        <span>Return to Command</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
                            AI Power <span className="text-blue-600">Toolkit.</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            A curated suite of specialized AI agents designed to handle the heavy lifting of your preparation journey.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <div 
                            key={index} 
                            className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 border border-gray-100 flex flex-col cursor-pointer relative overflow-hidden"
                            onClick={() => onNavigate(tool.page)}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </div>

                            <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 transition-colors duration-300">
                                <div className="scale-125">{tool.icon}</div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8 flex-grow">{tool.description}</p>
                            
                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Status: Active</span>
                                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                                    Launch Agent <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 rounded-[48px] bg-gray-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -ml-48 -mt-48"></div>
                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Request a Custom Tool?</h2>
                        <p className="text-gray-400 font-medium text-lg italic">"I wish I had a tool that could..."</p>
                        <p className="text-gray-400 mt-2">Our community is the core of our development. Let us know what you need.</p>
                    </div>
                    <button className="relative z-10 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-xl">
                        Submit Feature Request
                    </button>
                </div>
            </div>
        </div>
    );
};
