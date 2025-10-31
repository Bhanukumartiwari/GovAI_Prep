import React from 'react';
import { Page } from '../App';
import { PlannerIcon } from '../components/icons/PlannerIcon';
import { GeneratorIcon } from '../components/icons/GeneratorIcon';
import { SimulatorIcon } from '../components/icons/SimulatorIcon';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import { InfoIcon } from '../components/icons/InfoIcon';

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
    }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Preparation Tools</h1>
                    <p className="mt-3 text-xl text-gray-500">Leverage AI to supercharge your study sessions.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tools.map((tool, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-200 flex flex-col items-start">
                            <div className="flex-shrink-0">
                                {tool.icon}
                            </div>
                            <h3 className="mt-4 text-2xl font-bold text-gray-900">{tool.title}</h3>
                            <p className="mt-2 text-base text-gray-600 flex-grow">{tool.description}</p>
                            <button 
                                onClick={() => onNavigate(tool.page)}
                                className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                                Use Tool
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};