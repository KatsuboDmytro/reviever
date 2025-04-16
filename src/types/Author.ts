export type Authors = {
  address: string;
  avatar: string;
  cover_image: string;
  description: string;
  display_name: string;
  email: string;
  occupation: string;
  phone: string;
  social_media: { [key: string]: string }[];
  tag: string;
  website: string;
  authors_id: string;
  amount_of_following: number,
  amount_of_followers: number,
  amount_of_posts: number,
};
