import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env['MONGODB_URI'];

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
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const collection = client.db('blog').collection('posts');
        const find = await collection.findOne({ _id: new ObjectId(postId) });
        res.status(200).json(find);
      } finally {
        await client.close();
      }
      break;
  }
}
