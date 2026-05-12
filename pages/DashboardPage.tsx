import React from 'react';
import { Page, Activity } from '../App';
import { DoubtSolver } from '../components/DoubtSolver';
import { GoalsIcon } from '../components/icons/GoalsIcon';
import { QuizIcon } from '../components/icons/QuizIcon';
import { ChatIcon } from '../components/icons/ChatIcon';
import { BackIcon } from '../components/icons/BackIcon';
import { Zap } from 'lucide-react';

const features = [
    {
        icon: <Zap className="w-5 h-5 fill-indigo-600/20" />,
        title: "Daily Intelligence",
        description: "Your automated Top 20 feed: 10 Current Affairs & 10 Static GK facts for today.",
        button: "View Daily Feed",
        page: 'daily-feed' as Page
    },
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
    }
];

interface DashboardPageProps {
    onNavigate: (page: Page) => void;
    activities: Activity[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, activities }) => {
    const lastThreeActivities = activities.slice(0, 3);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
                <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                    <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">Home</button>
                    <span className="mx-3 opacity-30">/</span>
                    <span className="text-gray-900">Your Dashboard</span>
                </nav>
                <button 
                    onClick={() => onNavigate('home')}
                    className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                >
                    <BackIcon />
                    <span>Back to Home</span>
                </button>
            </div>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                     <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                        <span className="w-6 h-[2px] bg-blue-600"></span>
                        Active Session
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Aspirant!</span>
                    </h1>
                    <p className="text-gray-500 text-base mt-2 font-medium max-w-xl">
                        You're on a 5-day study streak. Complete today's targets to earn your next badge.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-sm">
                            🔥
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Streak</p>
                            <p className="text-sm font-bold text-gray-900">12 Days</p>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            onClick={() => feature.page && onNavigate(feature.page)}
                            className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col ${feature.page ? 'cursor-pointer' : ''}`}
                        >
                            <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl text-blue-600 flex items-center justify-center mb-5 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1.5 font-display">{feature.title}</h3>
                            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6">{feature.description}</p>
                            
                            {feature.status && (
                                <div className="mt-auto">
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: feature.status.split('%')[0] + '%' }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">{feature.status}</p>
                                </div>
                            )}
                            
                            {feature.button && (
                                <button className="mt-auto w-full py-2.5 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-900 group-hover:shadow-lg group-hover:shadow-blue-500/20 font-bold rounded-lg transition-all text-xs">
                                    {feature.button}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between group shadow-lg">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 text-center py-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-4">Exam Countdown</h4>
                            <p className="text-3xl font-bold mb-1">42 Days</p>
                            <p className="text-blue-100 text-xs font-medium">UPSC Prelims 2024</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                Recent Activity
                            </h3>
                        </div>
                        {lastThreeActivities.length > 0 ? (
                            <div className="space-y-4">
                                {lastThreeActivities.map((activity) => (
                                    <div key={activity.id} className="relative pl-4 border-l-2 border-gray-50">
                                        <p className="text-xs font-bold text-gray-900 leading-snug">{activity.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-4 text-center">
                                <p className="text-xs font-medium text-gray-400 italic">No recent actions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 font-display tracking-tight">AI Study <span className="text-blue-600">Mentor.</span></h2>
                            <p className="text-gray-400 font-medium mt-1 text-sm">Ask any question related to your exam and get instant help.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mentor Online</span>
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DoubtSolver />
                </div>
            </div>
        </div>
    );
};
