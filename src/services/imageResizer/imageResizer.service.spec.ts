import { CacheManager } from '../../core/cacheManager'
import { IImageFetcher } from '../../core/imageFetcher'
import { IImageResizer } from '../../core/imageResizer'
import { ImageResizerService } from './imageResizer.service'

describe('ImageResizerService', () => {
  let imageFetcher: jest.Mocked<IImageFetcher>
  let imageResizer: jest.Mocked<IImageResizer>
  let cacheManager: jest.Mocked<CacheManager>
  let imageResizerService: ImageResizerService

  beforeEach(() => {
    imageFetcher = {
      fetchImage: jest.fn(),
    }

    imageResizer = {
      resize: jest.fn(),
    }

    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<CacheManager>

    imageResizerService = new ImageResizerService(imageFetcher, imageResizer, cacheManager)
  })

  it('should return cached image if available', async () => {
    const imageUrl = 'http://example.com/image.jpg'
    const width = 100
    const height = 100
    const cachedImage = Buffer.from('cached-image-data').toString('base64')

    cacheManager.get.mockResolvedValue(cachedImage)

    const result = await imageResizerService.resizeImage(imageUrl, width, height)

    expect(cacheManager.get).toHaveBeenCalledWith(`${imageUrl}-${width}-${height}`)
    expect(result).toEqual(Buffer.from(cachedImage, 'base64'))
    expect(imageFetcher.fetchImage).not.toHaveBeenCalled()
    expect(imageResizer.resize).not.toHaveBeenCalled()
  })

  it('should fetch, resize, and cache image if not in cache', async () => {
    const imageUrl = 'http://example.com/image.jpg'
    const width = 100
    const height = 100
    const imageBuffer = Buffer.from('image-data')
    const resizedImage = Buffer.from('resized-image-data')

    cacheManager.get.mockResolvedValue(null)
    imageFetcher.fetchImage.mockResolvedValue(imageBuffer)
    imageResizer.resize.mockResolvedValue(resizedImage)

    const result = await imageResizerService.resizeImage(imageUrl, width, height)

    expect(cacheManager.get).toHaveBeenCalledWith(`${imageUrl}-${width}-${height}`)
    expect(imageFetcher.fetchImage).toHaveBeenCalledWith(imageUrl)
    expect(imageResizer.resize).toHaveBeenCalledWith(imageBuffer, width, height)
    expect(cacheManager.set).toHaveBeenCalledWith(`${imageUrl}-${width}-${height}`, resizedImage.toString('base64'))
    expect(result).toEqual(resizedImage)
  })

  it('should throw an error if fetching image fails', async () => {
    const imageUrl = 'http://example.com/image.jpg'
    const width = 100
    const height = 100

    cacheManager.get.mockResolvedValue(null)
    imageFetcher.fetchImage.mockRejectedValue(new Error('Network Error'))

    await expect(imageResizerService.resizeImage(imageUrl, width, height)).rejects.toThrow('Network Error')
  })
})
