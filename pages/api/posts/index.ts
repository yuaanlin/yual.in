import {
  getPostsInMongo,
  getPostsInRedis,
  setPostsInRedis
} from '../../../services/getPosts';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      let isSent = false;
      const promises: Promise<void>[] = [];
      promises.push(async function () {
        const postsInMongo = await getPostsInMongo();
        if (!isSent) {
          res.status(200).json(postsInMongo);
          isSent = true;
        }
        await setPostsInRedis(postsInMongo);
      }());
      promises.push(async function () {
        const postsInRedis = await getPostsInRedis();
        if (!isSent) {
          res.status(200).json(postsInRedis);
          isSent = true;
        }
      }());
      await Promise.all(promises);
  }
}
