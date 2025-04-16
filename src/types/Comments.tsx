export interface Comment {
  comment_id: string,
  news_id: string,
  parent_id: string | null,
  author_id: string,
  text: string,
  date: string,
  likes: number,
  dislikes: number,
}