import React from 'react';
import { Page } from '../App';
import { BackIcon } from '../components/icons/BackIcon';

interface ContactPageProps {
    onNavigate: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline mb-6"
            >
                <BackIcon />
                Back to Home
            </button>
            <div className="py-16">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Contact Us</h1>
            <p className="text-lg text-gray-600 text-center">We'd love to hear from you. This is a placeholder page.</p>
            </div>
        </div>
    );
};
