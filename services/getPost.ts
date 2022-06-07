import getMongoClient from './getMongoClient';
import Post from '../models/post';
import { ObjectId } from 'mongodb';
import { createClient, RedisClientType } from '@redis/client';

const redisUrl = process.env['REDIS_URL'];

export async function getPostBySlug(slug: string): Promise<Post> {
  let redis: RedisClientType | undefined;
  if (redisUrl) {
    redis = createClient({ url: redisUrl });
    await redis.connect();
    const cacheRaw = await redis.get('post_' + slug);
    if (cacheRaw) return JSON.parse(cacheRaw) as unknown as Post;
  }
  const client = await getMongoClient();
  try {
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ slug });
    await redis?.set('post_' + slug, JSON.stringify(find));
    return find as Post;
  } finally {
    await client.close();
  }
}

async function getPost(postId: string): Promise<Post> {
  let redis: RedisClientType | undefined;
  if (redisUrl) {
    redis = createClient({ url: redisUrl });
    await redis.connect();
    const cacheRaw = await redis.get('post_' + postId);
    if (cacheRaw) return JSON.parse(cacheRaw) as unknown as Post;
  }
  const client = await getMongoClient();
  try {
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ _id: new ObjectId(postId) });
    await redis?.set('post_' + postId, JSON.stringify(find));
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

export async function getPostInRedis(
  postId: ObjectId): Promise<Post | undefined> {
  if (!redisUrl)
    throw new Error('Server cannot connect to database.');
  const client = createClient({ url: redisUrl });
  await client.connect();
  const cacheRaw = await client.get('post_' + postId.toHexString());
  if (!cacheRaw) return;
  return JSON.parse(cacheRaw) as unknown as Post;
}

export async function setPostInRedis(post: Post) {
  if (!redisUrl)
    throw new Error('Server cannot connect to database.');
  const client = createClient({ url: redisUrl });
  await client.connect();
  await client.set('post_' + post._id.toHexString(), JSON.stringify(post));
}

export default getPost;
