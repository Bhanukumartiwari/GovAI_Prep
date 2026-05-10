import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Page } from '../App';
import { BLOG_POSTS } from '../constants/blogData';
import { BackIcon } from '../components/icons/BackIcon';
import { CalendarIcon, UserIcon, ClockIcon, Share2Icon } from 'lucide-react';

interface BlogPostPageProps {
  onNavigate: (page: Page) => void;
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onNavigate, slug }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (post) {
      document.title = `${post.title} | GovAI Prep Blog`;
      
      // Handle Canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `https://gov-ai-prep.vercel.app/blog/${post.slug}`);
    }

    return () => {
      document.title = 'GovAI Prep - Indian Government Exam Mastery';
    };
  }, [post, slug]);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <button 
          onClick={() => onNavigate('blog' as any)}
          className="text-blue-600 font-bold underline"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => onNavigate('blog' as any)}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
          >
            <BackIcon />
            <span>Return to Archives</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all">
                <Share2Icon size={18} />
            </button>
          </div>
        </div>

        <article>
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-10">
              {post.title}
            </h1>

            {post.image && (
              <div className="mb-12 rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto object-cover max-h-[500px]" 
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <UserIcon size={16} />
                </div>
                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest">{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={16} className="text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest">{post.readTime}</span>
              </div>
            </div>
          </header>

          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-20 pt-10 border-t border-gray-100">
            <div className="bg-gray-50 rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black">
                G
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">GovAI Editorial Team</h4>
                <p className="text-sm text-gray-500 font-medium max-w-md leading-relaxed">
                  Specialized experts focused on distilling complex governmental protocols and syllabus cross-references into actionable study intelligence.
                </p>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};
