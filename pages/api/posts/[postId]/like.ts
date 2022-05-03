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
        const count = await mongo.db('blog').collection('likes')
          .countDocuments({
            userId: user._id,
            postId: postObjectId,
          });
        if (count > 10) {
          res.status(200).json({ message: 'Already liked 10 times' });
          return;
        }
        await mongo.db('blog').collection('likes').insertOne({
          userId: user._id,
          postId: postObjectId,
          likedAt: new Date(),
        });
        res.status(201).json({
          userId: user._id,
          postId: postObjectId,
          count: count + 1
        });
      } catch (err) {
        res.status(404).json({ error: 'Post not found' });
      }
      break;
    case 'GET':
      try {
        const mongo = await getMongoClient();
        const find = await mongo.db('blog').collection('likes')
          .find({ postId: postObjectId });
        const likes = await find.toArray();
        const likeUserIds = likes.map(like => like.userId);
        const users = await mongo.db('blog').collection('users')
          .find({ _id: { $in: likeUserIds } })
          .toArray();
        const userAvatars = users.map(user => user.avatar);
        return res.status(200).json({
          likeCount: likes.length,
          userAvatars,
        });
      } catch (err) {
        res.status(404).json({ error: 'Post not found' });
      }
  }
}
