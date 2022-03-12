import robotjs from 'robotjs'
import { mog } from '../../utils/lib/helper'
import Jimp from 'jimp'

export const captureScreenshot = () => {
  const screenSize = robotjs.getScreenSize()
  const bmp = robotjs.screen.capture(0, 0, screenSize.width, screenSize.height)

  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(bmp.width, bmp.height)
      let pos = 0
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        image.bitmap.data[idx + 2] = bmp.image.readUInt8(pos++)
        image.bitmap.data[idx + 1] = bmp.image.readUInt8(pos++)
        image.bitmap.data[idx + 0] = bmp.image.readUInt8(pos++)
        image.bitmap.data[idx + 3] = bmp.image.readUInt8(pos++)
      })
      resolve(image)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

export const getPixelColor = () => {
  const { x, y } = robotjs.getMousePos()
  const pixelColor = robotjs.getPixelColor(x, y)

  mog('Pixel Color', { pixelColor, x, y })
}
