import { mog } from '@utils/lib/mog'
import Compress from 'compress.js'
import toast from 'react-hot-toast'

import { S3UploadClient } from '@workduck-io/dwindle'

export const uploadImageToWDCDN = async (
  data: string | ArrayBuffer,
  showAlert = true
): Promise<string | ArrayBuffer> => {
  if (typeof data === 'string') {
    try {
      const compress = new Compress()
      const parsedImage = data.split(',')[1]

      const file = Compress.convertBase64ToFile(parsedImage)
      const compressedImg = (
        await compress.compress([file], {
          size: 4,
          quality: 0.9
        })
      )[0]

      mog('FileAfterCompression', { compressedImg })
      if (showAlert !== false) toast('Uploading image')
      const resp = await S3UploadClient(compressedImg.data, {
        giveCloudFrontURL: true,
        bucket: 'workduck-app-files',
        fileType: compressedImg.ext,
        parseBase64String: false
      })
      return resp
    } catch (error) {
      mog('UploadImageFailed', { error })
      return data
    }
  } else {
    return data
  }
}
