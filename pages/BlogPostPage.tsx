import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Page } from '../App';
import { BLOG_POSTS } from '../constants/blogData';
import { CommentSection } from '../components/CommentSection';
import { BackIcon } from '../components/icons/BackIcon';
import { CalendarIcon, UserIcon, ClockIcon, Share2Icon, BookOpen, X, Globe, Briefcase, SendHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPostPageProps {
  onNavigate: (page: Page) => void;
  slug: string;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onNavigate, slug }) => {
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const [isReaderMode, setIsReaderMode] = useState(false);

  const shareUrl = `https://gov-ai-prep.vercel.app/blog/${post?.slug}`;
  const shareTitle = post?.title || '';

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (post) {
      document.title = `${post.title} | GovAI Prep Blog`;
      
      // Handle Meta Description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.excerpt);
      
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
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Advanced AI-powered exam preparation platform for UPSC, SSC, and State Level examinations in India.');
      }
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
    <div className={`min-h-screen transition-colors duration-500 ${isReaderMode ? 'bg-[#f8f5f0]' : 'bg-white'}`}>
      <AnimatePresence>
        {isReaderMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#f8f5f0]/80 backdrop-blur-md border-b border-orange-100 py-4"
          >
            <div className="container mx-auto px-4 max-w-3xl flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-800/40">Reader Mode Active</span>
              <button 
                onClick={() => setIsReaderMode(false)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-900 hover:text-orange-600 transition-colors"
              >
                <span>Exit Reader Mode</span>
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-500 ${isReaderMode ? 'max-w-3xl pt-24' : 'max-w-4xl'}`}>
        {!isReaderMode && (
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => onNavigate('blog' as any)}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
            >
              <BackIcon />
              <span>Return to Archives</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsReaderMode(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all mr-2"
              >
                <BookOpen size={14} />
                <span>Reader Mode</span>
              </button>
              
              <div className="flex items-center gap-2 border-l border-gray-100 pl-4 ml-2">
                <button 
                  onClick={shareOnTwitter}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-100 transition-all bg-white"
                  title="Share on Twitter"
                >
                    <SendHorizontal size={16} />
                </button>
                <button 
                  onClick={shareOnFacebook}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all bg-white"
                  title="Share on Facebook"
                >
                    <Globe size={16} />
                </button>
                <button 
                  onClick={shareOnLinkedIn}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-700 hover:border-blue-100 transition-all bg-white"
                  title="Share on LinkedIn"
                >
                    <Briefcase size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <article className={isReaderMode ? 'prose-sepia' : ''}>
          <header className={`mb-16 ${isReaderMode ? 'text-center' : ''}`}>
            {!isReaderMode && (
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                  {post.category}
                </span>
              </div>
            )}
            
            <h1 className={`font-black text-gray-900 leading-[1.1] tracking-tight mb-10 transition-all duration-500 ${isReaderMode ? 'text-3xl md:text-4xl italic text-[#433422]' : 'text-4xl md:text-5xl lg:text-6xl text-gray-900'}`}>
              {post.title}
            </h1>

            {post.image && !isReaderMode && (
              <div className="mb-12 rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-auto object-cover max-h-[500px]" 
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className={`flex flex-wrap items-center gap-y-4 gap-x-8 text-gray-400 ${isReaderMode ? 'justify-center border-b border-orange-100 pb-10' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <UserIcon size={16} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${isReaderMode ? 'text-orange-900/60' : 'text-gray-900'}`}>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className={isReaderMode ? 'text-orange-400' : 'text-blue-500'} />
                <span className="text-xs font-bold uppercase tracking-widest">{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={16} className={isReaderMode ? 'text-orange-400' : 'text-blue-500'} />
                <span className="text-xs font-bold uppercase tracking-widest">{post.readTime}</span>
              </div>
            </div>
          </header>

          <div className={`markdown-body transition-all duration-500 ${isReaderMode ? 'text-lg leading-loose text-[#433422] selection:bg-orange-200' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {!isReaderMode && (
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
          )}
        </article>

        {!isReaderMode && (
          <CommentSection 
            postId={post.id} 
            initialComments={post.comments} 
          />
        )}

        {!isReaderMode && (
          /* Related Posts Section */
          <section className="mt-24">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
                Continue <span className="text-blue-600">Reading</span>
              </h3>
              <div className="h-px flex-1 bg-gray-100 ml-8 hidden md:block"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS
                .filter(p => p.slug !== slug)
                .sort((a, b) => {
                  // Priority 1: Keyword match count
                  const aKeywordMatches = a.keywords?.filter(k => post.keywords?.includes(k)).length || 0;
                  const bKeywordMatches = b.keywords?.filter(k => post.keywords?.includes(k)).length || 0;
                  
                  if (aKeywordMatches !== bKeywordMatches) {
                    return bKeywordMatches - aKeywordMatches;
                  }

                  // Priority 2: Same Category
                  if (a.category === post.category && b.category !== post.category) return -1;
                  if (b.category === post.category && a.category !== post.category) return 1;
                  
                  // Priority 3: Title keyword match
                  const aTitleMatch = a.title.toLowerCase().split(' ').some(word => word.length > 3 && post.title.toLowerCase().includes(word));
                  const bTitleMatch = b.title.toLowerCase().split(' ').some(word => word.length > 3 && post.title.toLowerCase().includes(word));
                  if (aTitleMatch && !bTitleMatch) return -1;
                  if (bTitleMatch && !aTitleMatch) return 1;

                  return 0;
                })
                .slice(0, 3)
                .map(relatedPost => (
                  <div 
                    key={relatedPost.id}
                    onClick={() => onNavigate('blog-post' as any, relatedPost.slug)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-4 bg-gray-100">
                      {relatedPost.image ? (
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ClockIcon size={40} />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">
                      {relatedPost.category}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
