import { client } from '@workduck-io/dwindle'
import { apiURLs } from '../apis/routes'

export const uploadImageToWDCDN = async (data: string | ArrayBuffer): Promise<string | ArrayBuffer> => {
  if (typeof data === 'string') {
    const parsedImage = data.split(',')[1]
    const resp = await client.post(apiURLs.createImageURL, {
      encodedString: parsedImage
    })
    const path = await resp.data
    const publicURL = apiURLs.getImagePublicURL(path)
    return publicURL
  } else {
    return data
  }
}
