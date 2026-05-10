import React, { useState } from 'react';
import { Page } from '../App';
import { BLOG_POSTS } from '../constants/blogData';
import { BackIcon } from '../components/icons/BackIcon';
import { SearchIcon } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: Page, slug?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'History', 'Geography', 'Polity', 'Environment', 'Current Affairs', 'Economics', 'Static GK'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <nav className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition-colors">Dashboard</button>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-gray-900">Knowledge Blog</span>
        </nav>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100"
        >
          <BackIcon />
          <span>Exit Library</span>
        </button>
      </div>

      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-display mb-6">
          The <span className="text-blue-600">Editorial.</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl">
          Deep dives into complex exam topics, curated strategies, and high-yield insights for Indian government examination aspirants.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-grow">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === category ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-600'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search the archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
            <SearchIcon size={20} />
          </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <article 
              key={post.id}
              onClick={() => onNavigate('blog-post' as any, post.slug)}
              className="group bg-white rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
            >
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4 line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {post.author[0]}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">{post.author}</div>
                      <div className="text-[10px] font-bold text-gray-400">{post.date}</div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1 duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <SearchIcon size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No intelligence found</h3>
          <p className="text-gray-400 font-medium">Try adjusting your search filters or category parameters.</p>
        </div>
      )}
    </div>
  );
};
