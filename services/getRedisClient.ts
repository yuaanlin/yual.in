import { createClient, RedisClientType } from '@redis/client';
import type { RedisFunctions, RedisModules, RedisScripts } from 'redis';

type RedisClient = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

async function getRedisClient(): Promise<RedisClient> {
  const redisUrl = process.env['REDIS_URL'];
  if (!redisUrl) throw new Error('Server cannot connect to redis.');
  const redis = createClient({ url: redisUrl });
  await redis.connect();
  return redis;
}

export default getRedisClient;
