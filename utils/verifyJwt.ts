import User, { parseUser } from '../models/user';
import jwt from 'jsonwebtoken';

function verifyJwt(token: string) {
  return new Promise<User>((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      reject('JWT_SECRET is not defined');
      return;
    }
    if (!token) {
      reject('No token provided');
      return;
    }
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err || !user) {
        reject(err);
        return;
      }
      resolve(parseUser(user as unknown as User));
    });
  });
}

export default verifyJwt;
