import React from 'react';
import { AnalyticsIcon } from '../components/icons/AnalyticsIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { GoalsIcon } from '../components/icons/GoalsIcon';
import { Page } from '../App';
import { BackIcon } from '../components/icons/BackIcon';

// Mock Data
const mockStats = {
  averageScore: 78,
  accuracy: 82,
  testsTaken: 12,
};

const mockSubjectPerformance = [
  { subject: 'Polity', accuracy: 85 },
  { subject: 'History', accuracy: 72 },
  { subject: 'Economy', accuracy: 65 },
  { subject: 'Geography', accuracy: 78 },
  { subject: 'Science & Tech', accuracy: 91 },
];

const mockTestHistory = [
  { name: 'UPSC Polity Mock', score: '8/10', accuracy: '80%', date: '2023-10-25' },
  { name: 'SSC CGL Quant', score: '21/25', accuracy: '84%', date: '2023-10-22' },
  { name: 'Modern History Quiz', score: '3/5', accuracy: '60%', date: '2023-10-20' },
  { name: 'Banking Awareness', score: '9/10', accuracy: '90%', date: '2023-10-18' },
  { name: 'Geography Basics', score: '7/10', accuracy: '70%', date: '2023-10-15' },
];

interface AnalyticsPageProps {
    onNavigate: (page: Page) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
                <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                    <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                    <span className="mx-3 opacity-30">/</span>
                    <span className="text-gray-900">Operational Analytics</span>
                </nav>
                <button 
                    onClick={() => onNavigate('dashboard')}
                    className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
                >
                    <BackIcon />
                    <span>Return to Command</span>
                </button>
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-4">
                        Mission <span className="text-blue-600">Metrics.</span>
                    </h1>
                    <p className="text-base text-gray-500 font-medium leading-relaxed">
                        Comprehensive intelligence on your academic performance.
                    </p>
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<TargetIcon />} title="Mean Accuracy" value={`${mockStats.averageScore}%`} trend="+2.4%" />
                <StatCard icon={<CheckCircleIcon />} title="Peak Performance" value={`${mockStats.accuracy}%`} trend="+1.1%" />
                <StatCard icon={<GoalsIcon />} title="Simulation Count" value={mockStats.testsTaken.toString()} trend="Active" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Subject Performance */}
                <div className="lg:col-span-4 bg-white p-7 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                    <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-8 block">Vertical Mastery</h2>
                    <div className="space-y-6">
                        {mockSubjectPerformance.map(sub => (
                            <div key={sub.subject} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{sub.subject}</span>
                                    <span className="text-[10px] font-bold text-blue-600">{sub.accuracy}%</span>
                                </div>
                                <div className="w-full bg-gray-50 rounded-full h-1 overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 group-hover:bg-blue-400" 
                                        style={{width: `${sub.accuracy}%`}}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test History */}
                <div className="lg:col-span-8 bg-white p-7 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden">
                     <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-8 block">Deployment History</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3">Operation</th>
                                    <th className="pb-5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 text-center">Score</th>
                                    <th className="pb-5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 text-center">Efficiency</th>
                                    <th className="pb-5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {mockTestHistory.map((test, index) => (
                                    <tr key={index} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="py-5 px-3">
                                            <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{test.name}</div>
                                        </td>
                                        <td className="py-5 px-3 text-center">
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{test.score}</span>
                                        </td>
                                        <td className="py-5 px-3 text-center">
                                            <span className="text-[10px] font-bold text-blue-600">{test.accuracy}</span>
                                        </td>
                                        <td className="py-5 px-3 text-right">
                                            <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter">{test.date}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend }) => (
    <div className="bg-white p-7 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all scale-75 origin-top-left">
                {React.cloneElement(icon as React.ReactElement, { size: 24 })}
            </div>
            <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{trend}</span>
        </div>
        <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5">{title}</p>
            <p className="text-3xl font-bold text-gray-900 font-display tracking-tight">{value}</p>
        </div>
    </div>
);
