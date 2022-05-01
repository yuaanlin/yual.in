import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { Redis } from '@upstash/redis';

const uri = process.env['MONGODB_URI'];
const redisUrl = process.env['REDIS_URL'];
const redisToken = process.env['REDIS_TOKEN'];

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ error: 'postId is required' });
    return;
  }
  switch (req.method) {
    case 'GET':
      if (!uri) {
        res.status(500).json({ message: 'Server cannot connect to database.' });
        return;
      }
      let redis: Redis | undefined;
      if(redisUrl && redisToken) {
        redis = new Redis({ url: redisUrl, token: redisToken, });
        const cacheString = await redis.get('post_' + postId);
        if (cacheString) {
          res.status(200).json(cacheString);
          return;
        }
      }
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const collection = client.db('blog').collection('posts');
        const find = await collection.findOne({ _id: new ObjectId(postId) });
        res.status(200).json(find);
        await redis?.set('post_' + postId, JSON.stringify(find));
      } finally {
        await client.close();
      }
      break;
  }
}
