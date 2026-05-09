import React from 'react';
import { Page } from '../App';
import { DoubtSolver } from '../components/DoubtSolver';
import { GoalsIcon } from '../components/icons/GoalsIcon';
import { QuizIcon } from '../components/icons/QuizIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { BackIcon } from '../components/icons/BackIcon';

const features = [
    {
        icon: <GoalsIcon />,
        title: "Daily Goals",
        description: "Your personalized targets for today. Stay focused and track your progress.",
        status: "75% Completed"
    },
    {
        icon: <QuizIcon />,
        title: "Quick Quiz",
        description: "Test your knowledge with a short quiz on 'Indian Polity'.",
        button: "Start Quiz"
    },
    {
        icon: <ChatIcon />,
        title: "Study Group",
        description: "Join the discussion on 'Modern History' with fellow aspirants.",
        button: "Join Chat"
    }
];

interface DashboardPageProps {
    onNavigate: (page: Page) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Home
            </button>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Welcome back, Aspirant!</h1>
                <p className="text-lg text-gray-600 mt-2">Let's make today productive. Here's your dashboard.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            {feature.icon}
                            <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                        </div>
                        <p className="text-gray-600 flex-grow">{feature.description}</p>
                        {feature.status && <p className="mt-4 text-sm font-medium text-green-600">{feature.status}</p>}
                        {feature.button && <button className="mt-4 self-start px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">{feature.button}</button>}
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <DoubtSolver />
            </div>
        </div>
    );
};
