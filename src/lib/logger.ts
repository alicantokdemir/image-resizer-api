import winston from 'winston'

export function createLogger(level: string): winston.Logger {
  return winston.createLogger({
    level,
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  })
}
