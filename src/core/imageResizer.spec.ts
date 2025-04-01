import sharp from 'sharp'
import { ImageResizer } from './imageResizer'

jest.mock('sharp')
const mockedSharp = sharp as jest.MockedFunction<typeof sharp>

describe('ImageResizer', () => {
  let imageResizer: ImageResizer

  beforeEach(() => {
    jest.clearAllMocks()
    imageResizer = new ImageResizer()
  })

  it('should resize an image', async () => {
    const imageBuffer = Buffer.from('test-image-data', 'binary')
    const resizedBuffer = Buffer.from('resized-image-data', 'binary')
    const width = 100
    const height = 100

    const toBufferMock = jest.fn().mockResolvedValue(resizedBuffer)
    const resizeMock = jest.fn().mockReturnValue({ toBuffer: toBufferMock })
    mockedSharp.mockReturnValue({ resize: resizeMock } as any)

    const result = await imageResizer.resize(imageBuffer, width, height)

    expect(mockedSharp).toHaveBeenCalledWith(imageBuffer)
    expect(resizeMock).toHaveBeenCalledWith(width, height)
    expect(toBufferMock).toHaveBeenCalled()
    expect(result).toEqual(resizedBuffer)
  })
})
