export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'History' | 'Geography' | 'Polity' | 'Environment' | 'Current Affairs' | 'Economics' | 'Static GK';
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}
