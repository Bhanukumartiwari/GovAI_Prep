import React from 'react';
import { Page } from '../App';
import { BackIcon } from '../components/icons/BackIcon';

interface ContactPageProps {
    onNavigate: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
            <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap">
                <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors text-sm font-bold">Home</button>
                <span className="mx-3 opacity-30">/</span>
                <span className="text-gray-900 text-sm font-bold">Support Center</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight font-display mb-8 leading-tight">
                        How can we <span className="text-blue-600">help?</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
                        Whether you have questions about the syllabus, need technical assistance, or want to suggest a feature, our team is ready to assist your mission.
                    </p>

                    <div className="space-y-8">
                        {[
                            { title: 'Technical Support', info: 'support@govai-prep.com', detail: '24/7 Response for technical issues.' },
                            { title: 'Academic Guidance', info: 'experts@govai-prep.com', detail: 'Consult with our subject matter experts.' },
                            { title: 'Corporate/Press', info: 'office@govai-prep.com', detail: 'For institutional partnerships.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 group cursor-pointer">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                                    <span className="text-xs font-black">{i + 1}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">{item.title}</h3>
                                    <p className="text-blue-600 font-bold mb-1">{item.info}</p>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10 -mr-32 -mt-32 opacity-20"></div>
                    
                    <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 block">Identity</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full p-5 bg-gray-50 border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 block">Communications</label>
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full p-5 bg-gray-50 border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3 block">Objective</label>
                            <textarea 
                                placeholder="State your requirements..." 
                                rows={4}
                                className="w-full p-5 bg-gray-50 border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold resize-none"
                            />
                        </div>
                        <button className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-[0.2em]">
                            Dispatch Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
