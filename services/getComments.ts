import getMongoClient from './getMongoClient';
import { ObjectId } from 'mongodb';

export default async function (postObjectId: ObjectId) {
  const mongo = await getMongoClient();
  const comments = await mongo
    .db('blog')
    .collection('comments')
    .aggregate([
      { $match: { postId: postObjectId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
    ])
    .toArray();
  await mongo.close();
  return comments;
}
