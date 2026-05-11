import React from 'react';
import { Page } from '../App';
import { Logo } from './icons/Logo';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Learning Center</h3>
                        <ul className="space-y-4">
                            <li><button onClick={() => onNavigate('dashboard')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Your Dashboard</button></li>
                            <li><button onClick={() => onNavigate('tools')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">AI Tools</button></li>
                            <li><button onClick={() => onNavigate('study-planner')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Study Planner</button></li>
                            <li><button onClick={() => onNavigate('mock-tests')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Mock Tests</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Help & Support</h3>
                        <ul className="space-y-4">
                           <li><button onClick={() => onNavigate('contact')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Contact Us</button></li>
                           <li><button onClick={() => onNavigate('community')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Community</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Resources</h3>
                        <ul className="space-y-4">
                           <li><button onClick={() => onNavigate('exam-info')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Exam Details</button></li>
                           <li><button onClick={() => onNavigate('current-affairs')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Current Affairs</button></li>
                           <li><button onClick={() => onNavigate('blog')} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Our Blog</button></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Legal</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white scale-75">
                            <Logo />
                        </div>
                        <span className="text-sm font-black tracking-tighter text-gray-900 uppercase">
                            GOV<span className="text-blue-600">AI</span>.SYSTEM
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} GovAI Prep</p>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};