import getPost from '../../../services/getPost';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;
  if (!postId || typeof postId !== 'string') {
    res.status(400).json({ error: 'postId is required' });
    return;
  }
  switch (req.method) {
    case 'GET':
      try {
        const post = await getPost(postId);
        res.status(200).json(post);
      }catch (err) {
        res.status(404).json({ error: 'Post not found' });
      }
  }
}
