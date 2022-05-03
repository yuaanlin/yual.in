import { ObjectId } from 'bson/bson-ts34';

interface User {
  _id: ObjectId
  name: string
  email: string
  avatarUrl: string
}

export default User;
