import User, { parseUser } from '../models/user';
import jwt from 'jsonwebtoken';

function verifyJwt(token: string) {
  return new Promise<User | null>((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      reject('JWT_SECRET is not defined');
      return;
    }
    if (!token) {
      resolve(null);
      return;
    }
    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err || !user) {
        resolve(null);
        return;
      }
      resolve(parseUser(user as unknown as User));
    });
  });
}

export default verifyJwt;
