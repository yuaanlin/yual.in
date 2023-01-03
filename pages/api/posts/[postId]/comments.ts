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
  const postObjectId = new ObjectId(postId);
  const mongo = await getMongoClient();
  switch (req.method) {
    case 'POST':
      const token = req.cookies.token;
      const user = await verifyJwt(token);
      if (!user) {
        await mongo.close();
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      try {
        await mongo.db('blog').collection('comments').insertOne({
          userId: user._id,
          postId: postObjectId,
          createdAt: new Date(),
          content: req.body.content,
        });
        await mongo.close();
        res.status(201).json({ ok: true });
      } catch (err) {
        console.error(err);
        await mongo.close();
        res.status(404).json({ error: 'Post not found' });
      }
    case 'GET':
      try {
        const comments = await mongo
          .db('blog')
          .collection('comments')
          .aggregate([
            { $match: { postId: postObjectId } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'author',
              },
            },
            { $unwind: '$author' },
          ])
          .toArray();
        await mongo.close();
        res.status(200).json(comments);
      } catch (err) {
        console.error(err);
        await mongo.close();
        res.status(404).json({ error: 'Post not found' });
      }
  }
}
