import React from 'react';
import { Page } from '../App';
import { Logo } from './icons/Logo';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Solutions</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} className="text-base text-gray-600 hover:text-gray-900">AI Dashboard</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('tools'); }} className="text-base text-gray-600 hover:text-gray-900">Prep Tools</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('study-planner'); }} className="text-base text-gray-600 hover:text-gray-900">Study Planner</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('mock-tests'); }} className="text-base text-gray-600 hover:text-gray-900">Mock Tests</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Support</h3>
                        <ul className="mt-4 space-y-2">
                           <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-base text-gray-600 hover:text-gray-900">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Company</h3>
                        <ul className="mt-4 space-y-2">
                           <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="text-base text-gray-600 hover:text-gray-900">Home</a></li>
                           <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('community'); }} className="text-base text-gray-600 hover:text-gray-900">Community</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy</a></li>
                            <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Logo />
                       <span className="text-lg font-bold text-blue-600">GovAI Prep</span>
                    </div>
                    <p className="text-base text-gray-400 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} GovAI Prep. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};