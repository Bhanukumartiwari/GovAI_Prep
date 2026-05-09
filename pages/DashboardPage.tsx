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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
                <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                    <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">Home</button>
                    <span className="mx-3 opacity-30">/</span>
                    <span className="text-gray-900">Intelligence Dashboard</span>
                </nav>
                <button 
                    onClick={() => onNavigate('home')}
                    className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                >
                    <BackIcon />
                    <span>Return to Home</span>
                </button>
            </div>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                     <div className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">
                        <span className="w-8 h-[2px] bg-blue-600"></span>
                        Active Session
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-display">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Aspirant!</span>
                    </h1>
                    <p className="text-gray-500 text-lg mt-3 font-medium max-w-xl">
                        You're on a 5-day study streak. Complete today's targets to earn your next achievement badge.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                            🔥
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Streak</p>
                            <p className="text-sm font-black text-gray-900">12 Days</p>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className="bg-white p-7 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl text-blue-600 flex items-center justify-center mb-6 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{feature.title}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">{feature.description}</p>
                            
                            {feature.status && (
                                <div className="mt-auto">
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: feature.status.split('%')[0] + '%' }}></div>
                                    </div>
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider">{feature.status}</p>
                                </div>
                            )}
                            
                            {feature.button && (
                                <button className="mt-auto w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors text-sm">
                                    {feature.button}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-4">Exam Countdown</h4>
                        <p className="text-4xl font-black mb-2">42 Days</p>
                        <p className="text-blue-100 text-sm font-medium">Until UPSC Prelims 2024</p>
                    </div>
                    <button onClick={() => onNavigate('exam-info')} className="relative z-10 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-sm font-bold transition-all border border-white/10">
                        View Detailed Pattern
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-blue-50/30 rounded-[48px] -rotate-1 pointer-events-none"></div>
                <div className="relative bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-blue-500/5 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Instant AI Doubt Solver</h2>
                            <p className="text-gray-500 font-medium mt-1 text-lg">Stuck on a concept? Ask our 24/7 AI tutor for instant clarity.</p>
                        </div>
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                                    <div className={`w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500`}></div>
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                                +1k
                            </div>
                        </div>
                    </div>
                    <DoubtSolver />
                </div>
            </div>
        </div>
    );
};
