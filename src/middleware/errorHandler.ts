import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  console.log('errorHandler: ', err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  })
}
