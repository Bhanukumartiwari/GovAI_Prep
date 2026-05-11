import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, User } from 'lucide-react';
import { Comment } from '../types/blog';

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialComments = [] }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Math.random().toString(36).substring(2, 9),
        author: authorName,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        content: newComment,
      };

      setComments([comment, ...comments]);
      setNewComment('');
      setAuthorName('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100" id="comments">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">
          Aspirant Discussion <span className="text-gray-400 font-medium ml-2">({comments.length})</span>
        </h2>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 rounded-[32px] p-6 md:p-8 mb-12 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
              <input
                type="text"
                id="author"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., Arjun Singh"
                className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Insight / Question</label>
            <textarea
              id="content"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts on this topic?"
              rows={4}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium resize-none"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-gray-200"
            >
              {isSubmitting ? (
                <>Posting...</>
              ) : (
                <>
                  Post Comment
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comment List */}
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 md:gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm overflow-hidden">
                    {comment.avatar ? (
                      <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-gray-900 text-base">{comment.author}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{comment.date}</span>
                  </div>
                  <div className="text-gray-600 text-sm leading-relaxed bg-white border border-gray-50 p-5 rounded-2xl shadow-sm">
                    {comment.content}
                  </div>
                  <div className="mt-3 flex gap-4">
                    <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Reply</button>
                    <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">Helpful</button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium text-sm">No comments yet. Be the first to start the discussion!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
