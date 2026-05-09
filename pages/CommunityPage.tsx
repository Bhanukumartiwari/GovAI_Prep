import React from 'react';
import { Page } from '../App';
import { ChatIcon } from '../components/icons/ChatIcon';
import { BackIcon } from '../components/icons/BackIcon';

interface CommunityPageProps {
    onNavigate: (page: Page) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Home
            </button>
            <div className="text-center py-16">
            <div className="flex justify-center items-center mb-4">
                <ChatIcon />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mt-4">Community Hub</h1>
            <p className="text-lg text-gray-600 mt-2">This feature is coming soon!</p>
            <p className="text-gray-500 mt-1">Connect with fellow aspirants, join study groups, and clear your doubts together.</p>
            </div>
        </div>
    );
};
