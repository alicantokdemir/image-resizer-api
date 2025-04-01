import * as express from 'express'
import { IImageResizerService } from '../services/imageResizer/imageResizer.service'
import { isValidUrl } from '../utils/isValidUrl'

export class ImageController {
  constructor(private imageResizerService: IImageResizerService) {}

  async resizeImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const width = parseInt(req.query.width as string, 10)
      const height = parseInt(req.query.height as string, 10)
      const imageUrl = (req.query.imageUrl as string) ?? ''

      if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
        res.status(400).send({ message: 'Invalid width or height' })
        return
      }

      if (!imageUrl || !isValidUrl(imageUrl)) {
        res.status(400).send({ message: 'Missing or invalid imageUrl' })
        return
      }

      const resizedImage = await this.imageResizerService.resizeImage(imageUrl, width, height)

      res.setHeader('Content-Type', 'image/jpeg')

      // Cache the resized image for 1 month
      const oneMonthInSeconds = 2592000
      res.setHeader('Cache-Control', `public, max-age=${oneMonthInSeconds}`)

      res.send(resizedImage)
    } catch (error) {
      next(error)
    }
  }
}
