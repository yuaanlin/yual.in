import { MongoClient } from 'mongodb';

const uri = process.env['MONGODB_URI_EXTERNAL'];

export default async function getMongoClient() {
  if (!uri) throw new Error('Server cannot connect to database.');
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}
