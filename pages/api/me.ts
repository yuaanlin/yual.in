import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!JWT_SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not defined' });
    return;
  }
  jwt.verify(req.cookies.token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
        error: err
      });
      return;
    }
    res.status(200).json(decoded);
  });
}
