import React from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { SimulatorIcon } from '../components/icons/SimulatorIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const features = [
    {
        icon: <PlannerIcon />,
        title: "AI Study Planner",
        description: "Get a dynamic study schedule that adapts to your progress and targets your weak areas."
    },
    {
        icon: <GeneratorIcon />,
        title: "Smart Question Generator",
        description: "Generate unlimited practice questions for any topic, tailored to the exam pattern."
    },
    {
        icon: <SimulatorIcon />,
        title: "Mock Test Simulator",
        description: "Experience real exam conditions with full-length mock tests and detailed analysis."
    },
    {
        icon: <AnalyticsIcon />,
        title: "Real-time Analytics",
        description: "Track your performance with in-depth analytics and actionable insights."
    }
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                        <span className="block">Master Your Government Exams</span>
                        <span className="block text-blue-600">with Adaptive AI</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500">
                        GovAI Prep provides personalized study plans, smart mock tests, and instant doubt solving to help you conquer UPSC, SSC, Banking, and State-level exams.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={() => onNavigate('dashboard')} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                            Start Smart Learning Now
                        </button>
                        <button onClick={() => onNavigate('tools')} className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Your Ultimate Preparation Toolkit</h2>
                        <p className="mt-2 text-lg text-gray-500">Everything you need to succeed, all in one place.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                       {features.map((feature, index) => (
                         <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform hover:-translate-y-1">
                             <div className="flex justify-center items-center mb-4 w-16 h-16 mx-auto bg-blue-100 rounded-full">
                                {feature.icon}
                             </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                       ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Success Stories from Our Aspirants</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-700">"GovAI Prep's AI planner was a game-changer for my UPSC preparation. It kept me on track and focused on what mattered most."</p>
                            <p className="mt-4 font-semibold text-gray-900">- Priya S., UPSC CSE Topper</p>
                        </div>
                         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-700">"The mock test simulator is incredibly accurate. I felt fully prepared for the actual banking exam after practicing here."</p>
                            <p className="mt-4 font-semibold text-gray-900">- Rahul K., IBPS PO</p>
                        </div>
                         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-700">"The doubt solver chatbot saved me countless hours. Instant answers to complex questions, anytime I needed them."</p>
                            <p className="mt-4 font-semibold text-gray-900">- Anjali M., SSC CGL</p>
                        </div>
                    </div>
                 </div>
            </section>
        </>
    );
};