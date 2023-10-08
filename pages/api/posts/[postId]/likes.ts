import getMongoClient from '../../../../services/getMongoClient';
import verifyJwt from '../../../../utils/verifyJwt';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log(new Date().toISOString(),
    req.method + ' /api/posts/[postId]/likes');

  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ error: 'postId is required' });
    return;
  }
  const postObjectId = new ObjectId(postId);

  console.log(new Date().toISOString(), 'getMongoClient');
  const mongo = await getMongoClient();
  console.log(new Date().toISOString(), 'getMongoClient done');

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
        const count = await mongo.db('blog').collection('likes')
          .countDocuments({
            userId: new ObjectId(user._id),
            postId: postObjectId,
          });
        if (count >= 10) {
          await mongo.close();
          res.status(200).json({ message: 'Already liked 10 times' });
          return;
        }
        await mongo.db('blog').collection('likes').insertOne({
          userId: new ObjectId(user._id),
          postId: postObjectId,
          likedAt: new Date(),
        });
        await mongo.close();
        res.status(201).json({
          userId: user._id,
          postId: postObjectId,
          count: count + 1
        });
      } catch (err) {
        console.error(err);
        await mongo.close();
        res.status(404).json({ error: 'Post not found' });
      }
      break;
    case 'GET':
      try {
        let userLike = 0;
        const token = req.cookies.token;
        console.log(new Date().toISOString(), 'verifyJwt');
        const user = await verifyJwt(token);
        console.log(new Date().toISOString(), 'verifyJwt done');
        if (user) {
          console.log(new Date().toISOString(), 'countDocuments');
          userLike = await mongo.db('blog').collection('likes')
            .countDocuments({
              userId: new ObjectId(user._id),
              postId: postObjectId,
            });
          console.log(new Date().toISOString(), 'countDocuments done');
        }

        console.log(new Date().toISOString(), 'find');
        const find = mongo.db('blog').collection('likes')
          .find({ postId: postObjectId });
        const likes = await find.toArray();
        console.log(new Date().toISOString(), 'find done');

        const likeUserIds = likes.map(like => like.userId);

        console.log(new Date().toISOString(), 'find users');
        const users = await mongo.db('blog').collection('users')
          .find({ _id: { $in: likeUserIds } })
          .toArray();
        console.log(new Date().toISOString(), 'find users done');

        const userAvatars = users.map(user => user.avatarUrl);
        console.log(new Date().toISOString(), 'find users done');

        console.log(new Date().toISOString(), 'close mongo');
        await mongo.close();
        console.log(new Date().toISOString(), 'close mongo done');

        res.status(200).json({
          userLike,
          likeCount: likes.length,
          userAvatars,
        });
      } catch (err) {
        console.error(err);
        res.status(404).json({ error: 'Post not found' });
      } finally {
        await mongo.close();
      }
  }
}
