import { MongoClient } from 'mongodb';

const uri = process.env['MONGO_URL'];

export default async function getMongoClient() {
  if (!uri) throw new Error('Server cannot connect to database.');
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}
