import { CacheManager } from '../../core/cacheManager'
import { IImageFetcher } from '../../core/imageFetcher'
import { IImageResizer } from '../../core/imageResizer'

export interface IImageResizerService {
  resizeImage(imageUrl: string, width: number, height: number): Promise<Buffer>
}

export class ImageResizerService {
  constructor(
    private imageFetcher: IImageFetcher,
    private imageResizer: IImageResizer,
    private cacheManager: CacheManager
  ) {}

  async resizeImage(imageUrl: string, width: number, height: number) {
    try {
      const cacheKey = `${imageUrl}-${width}-${height}`
      const cachedImage = await this.cacheManager.get(cacheKey)

      if (cachedImage) {
        // Returning cached image
        return Buffer.from(cachedImage, 'base64')
      }

      // Cached image not found, fetch and resize image
      const imageBuffer = await this.imageFetcher.fetchImage(imageUrl)

      const resizedImage = await this.imageResizer.resize(imageBuffer, width, height)

      this.cacheManager.set(cacheKey, resizedImage.toString('base64'))

      return resizedImage
    } catch (error) {
      throw error
    }
  }
}
