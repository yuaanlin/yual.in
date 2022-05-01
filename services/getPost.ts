import { Redis } from '@upstash/redis';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env['MONGODB_URI'];
const redisUrl = process.env['REDIS_URL'];
const redisToken = process.env['REDIS_TOKEN'];

async function getPost(postId: string) {
  if (!uri) throw new Error('Server cannot connect to database.');
  let redis: Redis | undefined;
  if(redisUrl && redisToken) {
    redis = new Redis({ url: redisUrl, token: redisToken });
    const cache = await redis.get('post_' + postId);
    if (cache) return cache;
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client.db('blog').collection('posts');
    const find = await collection.findOne({ _id: new ObjectId(postId) });
    await redis?.set('post_' + postId, JSON.stringify(find));
    return find;
  } finally {
    await client.close();
  }
}

export default getPost;
