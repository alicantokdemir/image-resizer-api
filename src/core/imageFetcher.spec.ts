import axios from 'axios'
import { ImageFetcher } from './imageFetcher'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
let imageFetcher: ImageFetcher

describe('fetchImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    imageFetcher = new ImageFetcher()
  })

  it('should fetch an image from a given URL', async () => {
    const url = 'http://example.com/image.jpg'
    const imageBuffer = Buffer.from('test-image-data', 'binary')
    mockedAxios.get.mockResolvedValue({ data: imageBuffer })

    const result = await imageFetcher.fetchImage(url)

    expect(mockedAxios.get).toHaveBeenCalledWith(url, { responseType: 'arraybuffer', maxContentLength: 10485760 })
    expect(result).toEqual(imageBuffer)
  })

  it('should throw an error if the fetch fails', async () => {
    const url = 'http://example.com/image.jpg'
    mockedAxios.get.mockRejectedValue(new Error('Network Error'))

    await expect(imageFetcher.fetchImage(url)).rejects.toThrow('Network Error')
  })

  it('should throw an error if the file size exceeds 10MB', async () => {
    const url = 'http://example.com/large-image.jpg'
    const sizeMoreThan10MB = 15 * 1024 * 1024

    mockedAxios.head.mockResolvedValue({ headers: { 'content-length': sizeMoreThan10MB.toString() } })

    await expect(imageFetcher.fetchImage(url)).rejects.toThrow('File size exceeds the 10MB limit')
    expect(mockedAxios.head).toHaveBeenCalledWith(url)
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })
})
