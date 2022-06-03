import { ObjectID } from 'bson';

interface Post {
  _id: ObjectID
  title: string
  createdAt: Date
  updatedAt: Date
  coverImageUrl: string
  content: string
  slug: string
}

export function parsePost(data: Post) {
  return {
    ...data,
    _id: new ObjectID(data._id),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt)
  };
}

export function serializePost(data: Post) {
  return {
    ...data,
    _id: data._id.toHexString(),
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString()
  };
}

export default Post;
