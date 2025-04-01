import { RedisClientType } from 'redis'
import { CacheManager } from './cacheManager'

describe('CacheManager', () => {
  let redisClient: RedisClientType
  let cacheManager: CacheManager

  beforeEach(() => {
    redisClient = {
      get: jest.fn(),
      setEx: jest.fn(),
    } as unknown as RedisClientType
    cacheManager = new CacheManager(redisClient)
  })

  it('should get a value from the cache', async () => {
    const key = 'test-key'
    const value = 'test-value'
    ;(redisClient.get as jest.Mock).mockResolvedValue(value)

    const result = await cacheManager.get(key)

    expect(redisClient.get).toHaveBeenCalledWith(key)
    expect(result).toBe(value)
  })

  it('should set a value in the cache with default TTL', async () => {
    const key = 'test-key'
    const value = 'test-value'
    const ttl = 3600

    await cacheManager.set(key, value)

    expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, value)
  })

  it('should set a value in the cache with custom TTL', async () => {
    const key = 'test-key'
    const value = 'test-value'
    const ttl = 1800

    await cacheManager.set(key, value, ttl)

    expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, value)
  })
})
