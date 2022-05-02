import { ObjectID } from 'bson';

interface Post {
  _id: ObjectID
  title: string
  createdAt: Date
  updatedAt: Date
  coverImageUrl: string
  content: string
}

export function parsePost(data?: Post) {
  if (!data) return undefined;
  return {
    ...data,
    _id: new ObjectID(data._id),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt)
  };
}

export default Post;
