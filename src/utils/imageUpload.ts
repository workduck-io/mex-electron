import { client } from '@workduck-io/dwindle'
import Compress from 'compress.js'

import { mog } from './lib/helper'
import { apiURLs } from '../apis/routes'

export const uploadImageToWDCDN = async (data: string | ArrayBuffer): Promise<string | ArrayBuffer> => {
  if (typeof data === 'string') {
    try {
      const compress = new Compress()
      const parsedImage = data.split(',')[1]

      const file = Compress.convertBase64ToFile(parsedImage)
      mog('FileSizeBeforeCompression', { size: `${file.size / 1000} KB` })
      const compressedImg = (
        await compress.compress([file], {
          size: 4,
          quality: 0.9
        })
      )[0]

      mog('FileSizeAfterCompression', { size: `${compressedImg.endSizeInMb * 1000} KB` })

      const resp = await client.post(apiURLs.createImageURL, {
        encodedString: compressedImg.data
      })
      const path = await resp.data
      return apiURLs.getImagePublicURL(path)
    } catch (error) {
      mog('UploadImageFailed', { error })
      return data
    }
  } else {
    return data
  }
}
