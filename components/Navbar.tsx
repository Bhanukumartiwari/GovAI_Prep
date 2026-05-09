import React from 'react';
import { Page } from '../App';
import { Logo } from './icons/Logo';

interface NavbarProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
    const navLinks: { page: Page; label: string }[] = [
        { page: 'home', label: 'Home' },
        { page: 'dashboard', label: 'AI Dashboard' },
        { page: 'tools', label: 'Preparation Tools' },
        { page: 'current-affairs', label: 'Current Affairs' },
        { page: 'community', label: 'Community' },
        { page: 'contact', label: 'Contact' },
    ];

    return (
        <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Logo />
                           </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Gov<span className="text-blue-600">AI</span> Prep
                            </span>
                        </a>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navLinks.map(({ page, label }) => (
                             <a
                                key={page}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate(page); }}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative group ${
                                    currentPage === page 
                                    ? 'text-blue-600 bg-blue-50/50' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                                {currentPage === page && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                                )}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-3">
                        <button className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                            Log in
                        </button>
                        <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-full shadow-lg shadow-gray-200 hover:bg-gray-800 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                            Join Community
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
