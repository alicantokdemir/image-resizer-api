import sharp from 'sharp'

export interface IImageResizer {
  resize(imageBuffer: Buffer, width: number, height: number): Promise<Buffer>
}

export class ImageResizer implements IImageResizer {
  async resize(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(imageBuffer).resize(width, height).toBuffer()
  }
}
