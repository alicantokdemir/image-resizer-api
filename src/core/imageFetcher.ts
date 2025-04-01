import axios from 'axios'
import { BadRequestError } from '../utils/errors'

export interface IImageFetcher {
  fetchImage(imageUrl: string): Promise<Buffer>
}

export class ImageFetcher implements IImageFetcher {
  static maxFileSize = 10 * 1024 * 1024 // 10MB in bytes

  async fetchImage(imageUrl: string): Promise<Buffer> {
    try {
      const size = await this.getFileSize(imageUrl)

      if (size && size > ImageFetcher.maxFileSize) {
        throw { response: { status: 413 } }
      }

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        maxContentLength: ImageFetcher.maxFileSize,
      })

      return Buffer.from(response.data)
    } catch (error) {
      if (error.response && error.response.status === 413) {
        throw new BadRequestError('File size exceeds the 10MB limit')
      }

      throw error
    }
  }

  async getFileSize(imageUrl: string): Promise<number> {
    try {
      const response = await axios.head(imageUrl)

      const contentLength = response.headers['content-length']

      return contentLength ? parseInt(contentLength, 10) : null
    } catch (error) {
      return null
    }
  }
}
