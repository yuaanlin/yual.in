import getMongoClient from '../../services/getMongoClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const CLIENT_ID =
  '161014027797-ugj4ctsem3iu68701fe48u0vgc1ck4qm.apps.googleusercontent.com';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!JWT_SECRET) {
    res.status(500).json({ message: 'JWT_SECRET is not set' });
    return;
  }
  let redirect = req.query.url;
  if (typeof redirect !== 'string') redirect = '/';
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: req.body.credential,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    res.status(400).json({ error: 'Invalid credential', });
    return;
  }
  const googleId = payload['sub'];
  const mongo = await getMongoClient();
  const find = await mongo.db('blog')
    .collection('users').findOne({ googleID: googleId });
  if (find) {
    const token = jwt.sign(find, JWT_SECRET);
    res.setHeader('Set-Cookie',
      `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    res.setHeader('Content-Type', 'text/html');
    res.end(`<script>window.location.pathname = "${redirect}"</script>`);
    return;
  } else {
    const user: any = {
      name: payload.name || '',
      avatarUrl: payload.picture || '',
      email: payload.email || '',
      googleID: googleId,
    };
    const insert = await mongo.db('blog').collection('users').insertOne(user);
    user._id = insert.insertedId;
    const token = jwt.sign(user, JWT_SECRET);
    res.setHeader('Set-Cookie',
      `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    res.setHeader('Content-Type', 'text/html');
    res.end(`<script>window.location.pathname = "${redirect}"</script>`);
    return;
  }
}
