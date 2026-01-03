export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  content: string;
  author: Author;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
