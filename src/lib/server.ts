import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'

import { addRoutes } from './routes'
import { errorHandler } from '../middleware/errorHandler'

type CreateServerOpts = {
  logger: winston.Logger
}

export function createServer({ logger }: CreateServerOpts): express.Express {
  const api = express()

  // Log incoming requests
  api.use(expressWinston.logger({ meta: true, winstonInstance: logger }))

  addRoutes(api)

  api.use(errorHandler)

  // Add an error handling logger
  api.use(expressWinston.errorLogger({ winstonInstance: logger }))

  return api
}
