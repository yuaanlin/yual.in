import Post from '../models/post';
import { MongoClient } from 'mongodb';
import { createClient } from '@redis/client';

const uri = process.env['MONGO_URL'];
const redisUrl = process.env['REDIS_URL'];

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
  if (!redisUrl)
    throw new Error('Server cannot connect to database.');
  const client = createClient({ url: redisUrl });
  await client.connect();
  const cacheRaw = await client.get('posts');
  if (!cacheRaw) return;
  const cache = JSON.parse(cacheRaw) as unknown as Post[];
  return cache.sort((a: Post, b: Post) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function setPostsInRedis(posts: Post[]) {
  if (!redisUrl)
    throw new Error('Server cannot connect to database.');
  const client = createClient({ url: redisUrl });
  await client.connect();
  await client.set('posts', JSON.stringify(posts));
}
