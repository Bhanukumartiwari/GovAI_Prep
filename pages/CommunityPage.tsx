import React from 'react';
import { Page } from '../App';
import { ChatIcon } from '../components/icons/ChatIcon';
import { BackIcon } from '../components/icons/BackIcon';

interface CommunityPageProps {
    onNavigate: (page: Page) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap">
                <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">Home</button>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-gray-900">Community Hub</span>
            </nav>

            <div className="relative overflow-hidden bg-white rounded-[64px] border border-gray-100 shadow-2xl p-8 md:p-24 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10 -mt-96 opacity-50"></div>
                
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-12">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Developing Connection
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight font-display mb-8 leading-tight">
                        The Aspirant <span className="text-blue-600">Circle.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-16 px-4">
                        We're architecting a high-performance social ecosystem for serious aspirants. Connect, collaborate, and compete in the ultimate study nexus.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-16">
                        {[
                            { title: 'Study Pods', desc: 'Real-time collaborative nodes for focused sprint sessions.' },
                            { title: 'Global Bench', desc: 'Compare analytics and performance against the top percentile.' },
                            { title: 'Senior Desk', desc: 'Direct access to verified rankers and subject matter experts.' }
                        ].map((feat, i) => (
                            <div key={i} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100/50">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter mb-2">{feat.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email for early access" 
                            className="w-full sm:w-80 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold placeholder:text-gray-400"
                        />
                        <button className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest whitespace-nowrap">
                            Request Beta Invite
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
