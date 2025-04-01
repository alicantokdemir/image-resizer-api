import { createLogger } from './lib/logger'
import { createServer } from './lib/server'
import { createClient, RedisClientType } from 'redis'

const config = {
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '8080', 10),
  logLevel: process.env.LOG_LEVEL || 'debug',
  redis: {
    url: process.env.REDIS_URL || 'redis://redis:6379',
  },
}

export const redisClient: RedisClientType = createClient(config.redis)

const logger = createLogger(config.logLevel)
const server = createServer({ logger })

try {
  server.listen(config.port, async () => {
    logger.info(`Server running at http://${config.host}:${config.port}`)
    await redisClient.connect()
    logger.info(`Connected to redis at ${config.redis.url}`)
    redisClient.on('error', (err) => logger.error('Redis Error: ' + err))
  })
} catch (err) {
  logger.error(err)
  process.exit(1)
}
