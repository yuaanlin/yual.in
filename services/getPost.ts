import getMongoClient from './getMongoClient';
import Post from '../models/post';
import { ObjectId } from 'mongodb';

export async function getPostBySlug(slug: string): Promise<Post> {
  const client = await getMongoClient();
  try {
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ slug });
    return find as Post;
  } finally {
    await client.close();
  }
}

async function getPost(postId: string): Promise<Post> {
  const client = await getMongoClient();
  try {
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ _id: new ObjectId(postId) });
    return find as Post;
  } finally {
    await client.close();
  }
}

export async function getPostInMongo(postId: ObjectId) {
  const client = await getMongoClient();
  try {
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne<Post>({ _id: postId });
    return find as Post;
  } finally {
    await client.close();
  }
}

export default getPost;
