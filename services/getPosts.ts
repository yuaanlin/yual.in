import Post from '../models/post';
import { Redis } from '@upstash/redis';
import { MongoClient } from 'mongodb';

const uri = process.env['MONGODB_URI'];
const redisUrl = process.env['REDIS_URL'];
const redisToken = process.env['REDIS_TOKEN'];

export async function getPostsInMongo(): Promise<Post[]> {
  if (!uri) throw new Error('Server cannot connect to database.');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db('blog').collection('posts');
    const find = await collection.find<Post>({});
    return (await find.toArray()).map(post => ({
      ...post,
      content: post.content.trim().substring(0, 100) + ' ...'
    })).sort((a: Post, b: Post) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } finally {
    await client.close();
  }
}

export async function getPostsInRedis(): Promise<Post[] | undefined> {
  if (!redisUrl || !redisToken)
    throw new Error('Server cannot connect to database.');
  const redis = new Redis({ url: redisUrl, token: redisToken });
  const cache = await redis.get<Post[]>('posts');
  if (cache) return cache.sort((a: Post, b: Post) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function setPostsInRedis(posts: Post[]) {
  if (!redisUrl || !redisToken)
    throw new Error('Server cannot connect to database.');
  const redis = new Redis({ url: redisUrl, token: redisToken });
  await redis.set('posts', posts);
}
