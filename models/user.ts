interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  googleID: string;
  registeredAt: Date;
}

export function parseUser(data: User) {
  return {
    ...data,
    _id: data._id,
    registeredAt: new Date(data.registeredAt)
  };
}

export default User;
