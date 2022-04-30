import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env['MONGODB_URI'];

export default async function (req: NextApiRequest, res: NextApiResponse) {
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
        const find = await collection.find();
        const posts = await find.toArray();
        res.status(200).json(posts);
      } finally {
        await client.close();
      }
      break;
  }
}
