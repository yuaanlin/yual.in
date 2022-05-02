import Post from '../models/post';
import { Redis } from '@upstash/redis';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env['MONGODB_URI'];
const redisUrl = process.env['REDIS_URL'];
const redisToken = process.env['REDIS_TOKEN'];

async function getPost(postId: string): Promise<Post> {
  if (!uri) throw new Error('Server cannot connect to database.');
  let redis: Redis | undefined;
  if (redisUrl && redisToken) {
    redis = new Redis({ url: redisUrl, token: redisToken });
    const cache = await redis.get('post_' + postId);
    if (cache) return cache as Post;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ _id: new ObjectId(postId) });
    await redis?.set('post_' + postId, JSON.stringify(find));
    return find as Post;
  } finally {
    await client.close();
  }
}

export async function getPostInMongo(postId: ObjectId) {
  if (!uri) throw new Error('Server cannot connect to database.');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne<Post>({ _id: postId });
    return find as Post;
  } finally {
    await client.close();
  }
}

export async function getPostInRedis(
  postId: ObjectId): Promise<Post | undefined> {
  if (!redisUrl || !redisToken)
    throw new Error('Server cannot connect to database.');
  const redis = new Redis({ url: redisUrl, token: redisToken });
  const cache = await redis.get<Post>('post_' + postId.toHexString());
  if (cache) return cache;
}

export async function setPostInRedis(post: Post) {
  if (!redisUrl || !redisToken)
    throw new Error('Server cannot connect to database.');
  const redis = new Redis({ url: redisUrl, token: redisToken });
  await redis.set('post_' + post._id.toHexString(), post);
}

export default getPost;
