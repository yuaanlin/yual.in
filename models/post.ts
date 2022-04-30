import { ObjectID } from 'bson';

interface Post {
  _id: ObjectID
  title: string
  createdAt: Date
  updatedAt: Date
  coverImageUrl: string
  content: string
}

export default Post;
