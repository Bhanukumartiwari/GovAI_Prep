import React from 'react';
import { ChatIcon } from '../components/icons/ChatIcon';

export const CommunityPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="flex justify-center items-center mb-4">
                <ChatIcon />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mt-4">Community Hub</h1>
            <p className="text-lg text-gray-600 mt-2">This feature is coming soon!</p>
            <p className="text-gray-500 mt-1">Connect with fellow aspirants, join study groups, and clear your doubts together.</p>
        </div>
    );
};
