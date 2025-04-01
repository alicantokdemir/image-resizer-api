import express from 'express'
import { readFile } from 'fs'
import { ImageController } from '../controllers/image.controller'
import { ImageResizerService } from '../services/imageResizer/imageResizer.service'
import { ImageFetcher } from '../core/imageFetcher'
import { ImageResizer } from '../core/imageResizer'
import { CacheManager } from '../core/cacheManager'
import { redisClient } from '../index'

export function addRoutes(api: express.Express): void {
  // TODO: refactor to use DI container
  const imageFetcher = new ImageFetcher()
  const imageResizer = new ImageResizer()
  const cacheManager = new CacheManager(redisClient)
  const imageResizerService = new ImageResizerService(imageFetcher, imageResizer, cacheManager)
  const imageController = new ImageController(imageResizerService)

  api.route('/hello').get((req, res) => {
    const name = req.query.name || 'stranger'
    res.send({ message: `Hello ${name}!` })
  })

  api.route('/favicon.ico').get((_req, res) => {
    readFile('static/favicon.png', (err, data) => {
      if (err) {
        res.sendStatus(500)
      } else {
        res.contentType('image/png')
        res.send(data)
      }
    })
  })

  api.route('/resize').get(imageController.resizeImage.bind(imageController))
}
