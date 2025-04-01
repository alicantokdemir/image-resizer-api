import type { RedisClientType } from 'redis'

export interface ICacheManager {
  get(key: string): Promise<string | null>
  set(key: string, value: Buffer, ttl?: number): Promise<void>
}

export class CacheManager {
  constructor(private redisClient: RedisClientType) {}

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  // one hour ttl by default
  async set(key: string, value: string, ttl = 3600): Promise<void> {
    await this.redisClient.setEx(key, ttl, value)
  }
}
