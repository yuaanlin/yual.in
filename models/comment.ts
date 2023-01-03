import User from './user';

interface Comment {
  _id: string;
  author: User;
  content: string;
  createdAt: Date;
  replies: Comment[];
}

export default Comment;
