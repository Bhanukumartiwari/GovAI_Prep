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
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex items-center gap-2">
                           <Logo />
                            <span className="text-xl font-bold text-blue-600">GovAI Prep</span>
                        </a>
                    </div>
                    <nav className="hidden md:flex md:space-x-8">
                        {navLinks.map(({ page, label }) => (
                             <a
                                key={page}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate(page); }}
                                className={`text-base font-medium transition-colors duration-200 ${currentPage === page ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">Log in</button>
                        <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
