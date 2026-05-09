import React from 'react';
import { Page } from '../App';
import { Logo } from './icons/Logo';

interface NavbarProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
    const navLinks: { page: Page; label: string }[] = [
        { page: 'home', label: 'Index' },
        { page: 'dashboard', label: 'Command' },
        { page: 'tools', label: 'Arsenal' },
        { page: 'current-affairs', label: 'Briefing' },
        { page: 'community', label: 'Network' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-2xl sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-3 active:scale-95 transition-transform">
                            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-gray-200">
                                <Logo />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-gray-900">
                                GOV<span className="text-blue-600">AI</span>.
                            </span>
                        </a>
                    </div>
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map(({ page, label }) => (
                            <a
                                key={page}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate(page); }}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative ${
                                    currentPage === page 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                                {currentPage === page && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                                )}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors">
                            Auth.01
                        </button>
                        <button 
                            onClick={() => onNavigate('dashboard')}
                            className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        >
                            Terminal Entry
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
