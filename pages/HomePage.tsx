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
            <section className="relative pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32 hidden lg:block"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-bold mb-6 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Revolutionizing Government Exam Prep
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 tracking-tight leading-[0.9] mb-8 font-display">
                            Master Exams <br />
                            <span className="text-blue-600 italic">with AI Precision.</span>
                        </h1>
                        
                        <p className="max-w-xl text-xl md:text-2xl text-gray-500 leading-relaxed mb-10 font-medium">
                            The first truly intelligent prep platform for UPSC, SSC, Banking, and State exams. From personalized schedules to smart document analysis.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => onNavigate('dashboard')} 
                                className="group relative px-8 py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-2xl hover:bg-black transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Learning Now
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </span>
                            </button>
                            <button 
                                onClick={() => onNavigate('exam-info')} 
                                className="px-8 py-5 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                            >
                                Explorer Exam Center
                            </button>
                        </div>

                        <div className="mt-16 flex items-center gap-8 grayscale opacity-50 overflow-x-auto pb-4 no-scrollbar">
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Trusted by candidates of</span>
                            <span className="text-2xl font-black font-display whitespace-nowrap">UPSC</span>
                            <span className="text-2xl font-black font-display whitespace-nowrap">SSC CGL</span>
                            <span className="text-2xl font-black font-display whitespace-nowrap">IBPS PO</span>
                            <span className="text-2xl font-black font-display whitespace-nowrap">STATE PSC</span>
                        </div>
                    </div>
                </div>

                {/* Abstract geometric decoration */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-[#F9FAFB] border-y border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-display mb-4">
                                The Ultimate Toolkit <br />
                                <span className="text-blue-600">for Serious Aspirants</span>
                            </h2>
                            <p className="text-lg text-gray-500 font-medium">We've combined advanced LLMs with proven pedagogy to build the tools you actually need.</p>
                        </div>
                        <button onClick={() => onNavigate('tools')} className="text-blue-600 font-bold hover:underline underline-offset-8">Explore all 12+ AI Tools →</button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {features.map((feature, index) => (
                         <div 
                            key={index} 
                            className="group bg-white p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer border border-gray-100 hover:border-blue-100 flex flex-col items-start text-left relative overflow-hidden"
                            onClick={() => feature.page && onNavigate(feature.page)}
                        >
                             <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                             </div>
                             <div className="flex justify-center items-center mb-6 w-14 h-14 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl text-blue-600 transition-colors duration-300">
                                {feature.icon}
                             </div>
                            <h3 className="text-2xl font-bold mb-3 font-display tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium mb-4">{feature.description}</p>
                            <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                Launch Tool
                            </div>
                        </div>
                       ))}
                    </div>
                </div>
            </section>

            {/* Quote / Social Proof */}
            <section className="py-32 bg-white relative overflow-hidden">
                 <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <span className="text-6xl font-display text-blue-100 absolute -top-10 left-0">"</span>
                        <h2 className="text-3xl md:text-5xl font-medium leading-[1.1] mb-12 font-serif italic text-gray-800">
                            "GovAI Prep literally restructured how I think about my syllabus. The AI generated mock tests are so close to the actual exam pattern, it's scary."
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full mb-4 shadow-xl border-4 border-white"></div>
                            <p className="font-bold text-gray-900">Rahul Sharma</p>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Cleared IBPS PO 2024</p>
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    );
};
