import { ObjectID } from 'bson';

interface User {
  _id: ObjectID
  name: string
  email: string
  avatarUrl: string
  googleID: string
  registeredAt: Date
}

export function parseUser(data: User) {
  return {
    ...data,
    _id: new ObjectID(data._id),
    registeredAt: new Date(data.registeredAt)
  };
}

export default User;
