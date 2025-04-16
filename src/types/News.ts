export interface ContentItem {
  id: number;
  type: string;
  value: string | string[];
}

export interface News {
  title: string;
  unchangeable: {
    date: string;
    author_id: string;
    avatar: string;
    display_name: string;
    author_email: string;
  };
  content: ContentItem[];
  hashtags: string[];
  news_id: string;
  isPublished: boolean;
  news_preview: string;
  likes: number;
  dislikes: number;
  comments: string[];
  views: number;
}