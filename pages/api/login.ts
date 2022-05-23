import getMongoClient from '../../services/getMongoClient';
import { GOOGLE_OAUTH_CLIENT_ID } from '../../config.client';
import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!JWT_SECRET) {
      res.status(500).json({ message: 'JWT_SECRET is not set' });
      return;
    }
    const client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);
    let redirect = '/';
    const user: any = {
      name: '',
      avatarUrl: '',
      email: '',
      googleID: '',
    };
    switch (req.method) {
      case 'POST':
        let redirectUrl = req.query.url;
        if (typeof redirectUrl === 'string') redirect = redirectUrl;
        const ticket = await client.verifyIdToken({
          idToken: req.body.credential,
          audience: GOOGLE_OAUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
          res.status(400).json({ error: 'Invalid credential', });
          return;
        }
        user.googleId = payload['sub'];
        user.name = payload['name'];
        user.avatarUrl = payload['picture'];
        user.email = payload['email'];
        break;
      case 'GET':
        const code = req.query.code;
        const queryState = req.query.state;
        if (typeof queryState === 'string') redirect = queryState;
        const googleAppSecret = process.env.GOOGLE_CLIENT_SECRET;
        const host = req.headers.host;
        const verify = await axios.post(
          'https://oauth2.googleapis.com/token',
          `client_id=${GOOGLE_OAUTH_CLIENT_ID}` +
          `&client_secret=${googleAppSecret}` +
          `&redirect_uri=https://${host}/api/login` +
          '&grant_type=authorization_code' +
          `&code=${code}`
        );

        const getUserInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          { headers: { Authorization: 'Bearer ' + verify.data.access_token } }
        );
        user.googleId = getUserInfoRes.data.id;
        user.name = getUserInfoRes.data.name;
        user.avatarUrl = getUserInfoRes.data.picture;
        user.email = getUserInfoRes.data.email;
    }
    const mongo = await getMongoClient();
    const find = await mongo.db('blog')
      .collection('users').findOne({ googleID: user.googleId });

    if (find) {
      const token = jwt.sign(find, JWT_SECRET);
      await mongo.close();
      res.setHeader('Set-Cookie',
        `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
      res.setHeader('Content-Type', 'text/html');
      res.end(`<script>window.location.pathname = "${redirect}"</script>`);
      return;
    }

    const insert = await mongo.db('blog')
      .collection('users').insertOne({
        googleID: user.googleId,
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
      });
    user._id = insert.insertedId;
    const token = jwt.sign(user, JWT_SECRET);
    await mongo.close();
    res.setHeader('Set-Cookie',
      `token=${token}; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    res.setHeader('Content-Type', 'text/html');
    res.end(`<script>window.location.pathname = "${redirect}"</script>`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
}
