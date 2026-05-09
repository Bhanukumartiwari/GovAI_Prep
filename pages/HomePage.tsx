import React from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { SimulatorIcon } from '../components/icons/SimulatorIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import { FileTextIcon } from '../components/icons/FileTextIcon';
import { InfoIcon } from '../components/icons/InfoIcon';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const features = [
    {
        icon: <PlannerIcon />,
        title: "AI Study Planner",
        description: "Get a dynamic study schedule that adapts to your progress and targets your weak areas.",
        page: 'study-planner' as Page
    },
    {
        icon: <GeneratorIcon />,
        title: "Smart Question Generator",
        description: "Generate unlimited practice questions for any topic, tailored to the exam pattern.",
        page: 'question-generator' as Page
    },
    {
        icon: <FileTextIcon />,
        title: "Document AI Analyzer",
        description: "Upload handwritten notes or PDFs (English/Hindi) for smart AI extraction and quizzes.",
        page: 'document-analyzer' as Page
    },
    {
        icon: <SimulatorIcon />,
        title: "Mock Test Simulator",
        description: "Experience real exam conditions with full-length mock tests and detailed analysis.",
        page: 'mock-tests' as Page
    },
    {
        icon: <AnalyticsIcon />,
        title: "Real-time Analytics",
        description: "Track your performance with in-depth analytics and actionable insights.",
        page: 'analytics' as Page
    },
    {
        icon: <InfoIcon />,
        title: "Exam Information",
        description: "Get comprehensive details on latest exam dates, patterns, and detailed syllabi.",
        page: 'exam-info' as Page
    }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32 hidden lg:block"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold mb-6 animate-fade-in">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                            Revolutionizing Government Exam Prep
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6 font-display">
                            Master Exams <br />
                            <span className="text-blue-600">with Intelligence.</span>
                        </h1>
                        
                        <p className="max-w-xl text-base md:text-lg text-gray-500 leading-relaxed mb-8 font-medium tracking-tight">
                            The advanced AI platform for UPSC, SSC, and State examinations. Synchronized patterns and real-time performance analytics.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={() => onNavigate('dashboard')} 
                                className="group relative px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-widest"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Learning
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </span>
                            </button>
                            <button 
                                onClick={() => onNavigate('exam-info')} 
                                className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm text-xs uppercase tracking-widest"
                            >
                                Exam Center
                            </button>
                        </div>

                        <div className="mt-10 flex items-center gap-6 grayscale opacity-40 overflow-x-auto pb-4 no-scrollbar">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Trusted by candidates</span>
                            <span className="text-lg font-bold font-display whitespace-nowrap">UPSC</span>
                            <span className="text-lg font-bold font-display whitespace-nowrap">SSC CGL</span>
                            <span className="text-lg font-bold font-display whitespace-nowrap">IBPS PO</span>
                            <span className="text-lg font-bold font-display whitespace-nowrap">STATE PSC</span>
                        </div>
                    </div>
                </div>

                {/* Abstract geometric decoration */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-slate-50 border-y border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-4 uppercase">
                                The AI <br />
                                <span className="text-blue-600">Ecosystem.</span>
                            </h2>
                            <p className="text-base text-gray-500 font-medium leading-relaxed">Integrated AI tools synchronized with proven preparation frameworks.</p>
                        </div>
                        <button onClick={() => onNavigate('tools')} className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-sm">View All Tools</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {features.map((feature, index) => (
                         <div 
                            key={index} 
                            className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
                            onClick={() => feature.page && onNavigate(feature.page)}
                        >
                             <div className="absolute top-6 right-6 text-[10px] font-bold text-gray-300 group-hover:text-blue-500 transition-colors tracking-[0.2em] uppercase">
                                NODE.0{index + 1}
                             </div>
                             
                             <div className="mb-6 w-12 h-12 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                                {feature.icon}
                             </div>

                             <h3 className="text-xl font-bold mb-3 font-display tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                             <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{feature.description}</p>
                             
                             <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 group-hover:translate-x-1 transition-transform">Launch Node</span>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                             </div>
                        </div>
                       ))}
                    </div>
                </div>
            </section>

            {/* Quote / Social Proof */}
            <section className="py-24 bg-white relative overflow-hidden">
                 <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-medium leading-[1.2] mb-10 font-serif italic text-gray-700">
                            "GovAI Prep restructured how I think about my syllabus. The AI generated tests are synchronized with actual patterns."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full mb-3 shadow-lg border-2 border-white"></div>
                            <p className="font-bold text-gray-900 text-sm">Rahul Sharma</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IBPS PO 2024 Aspirant</p>
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    );
};
