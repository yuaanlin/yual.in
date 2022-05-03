import getMongoClient from '../../../../services/getMongoClient';
import verifyJwt from '../../../../utils/verifyJwt';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ error: 'postId is required' });
    return;
  }
  const token = req.cookies.token;
  const user = await verifyJwt(token);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const postObjectId = new ObjectId(postId);
  switch (req.method) {
    case 'POST':
      try {
        const mongo = await getMongoClient();
        const inserted = await mongo.db('blog').collection('likes').insertOne({
          userId: user._id,
          postId: postObjectId,
          likedAt: new Date(),
        });
        res.status(201).json(inserted);
      } catch (err) {
        res.status(404).json({ error: 'Post not found' });
      }
  }
}
