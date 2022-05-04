import verifyJwt from '../../utils/verifyJwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not defined' });
    return;
  }
  try {
    const user = await verifyJwt(req.cookies.token);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err });
  }
}
