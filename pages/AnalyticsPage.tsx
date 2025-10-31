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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('tools')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Tools
            </button>
             <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full">
                    <AnalyticsIcon />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Performance Analytics</h1>
                    <p className="text-lg text-gray-600">Track your progress and identify areas for improvement.</p>
                </div>
             </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<TargetIcon />} title="Average Score" value={`${mockStats.averageScore}%`} />
                <StatCard icon={<CheckCircleIcon />} title="Overall Accuracy" value={`${mockStats.accuracy}%`} />
                <StatCard icon={<GoalsIcon />} title="Tests Taken" value={mockStats.testsTaken.toString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subject Performance */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Subject-wise Performance</h2>
                    <div className="space-y-4">
                        {mockSubjectPerformance.map(sub => (
                            <div key={sub.subject}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-base font-medium text-gray-700">{sub.subject}</span>
                                    <span className="text-sm font-medium text-blue-700">{sub.accuracy}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${sub.accuracy}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test History */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">Test History</h2>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Test Name</th>
                                    <th scope="col" className="px-6 py-3">Score</th>
                                    <th scope="col" className="px-6 py-3">Accuracy</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockTestHistory.map((test, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{test.name}</th>
                                        <td className="px-6 py-4">{test.score}</td>
                                        <td className="px-6 py-4">{test.accuracy}</td>
                                        <td className="px-6 py-4">{test.date}</td>
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
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);