import {
  getPostInMongo,
  getPostInRedis,
  setPostInRedis
} from '../../../services/getPost';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ error: 'postId is required' });
    return;
  }
  const postObjectId = new ObjectId(postId);
  switch (req.method) {
    case 'GET':
      try {
        let isSent = false;
        let promises: Promise<void>[] = [];
        promises.push(
          getPostInMongo(postObjectId)
            .then(async post => {
              if (!isSent) {
                res.status(200).json(post);
                isSent = true;
              }
              await setPostInRedis(post);
            }).catch(err => {
              if (!isSent) {
                res.status(500).json({ error: err.message });
                isSent = true;
              }
            }));
        promises.push(
          getPostInRedis(postObjectId)
            .then(async postInCache => {
              if (postInCache && !isSent) {
                isSent = true;
                res.status(200).json(postInCache);
              }
            }));
        await Promise.all(promises);
      } catch (err) {
        res.status(404).json({ error: 'Post not found' });
      }
  }
}
