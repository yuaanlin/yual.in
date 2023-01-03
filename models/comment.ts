import User from './user';

interface Comment {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
  replies: Comment[];
}

export default Comment;
