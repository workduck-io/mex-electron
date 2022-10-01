import { useApi } from '@apis/useSaveApi'
import { mog } from '@utils/lib/mog'

import { FileData } from '../types/data'

export const useFileSaveBuffer = () => {
  const { saveView } = useApi()

  const saveFileBuffer = (data: FileData) => {
    if (data.saveBuffer) {
      if (data.saveBuffer.views && data.saveBuffer.views.length > 0) {
        mog('Saving previously found views', { vw: data.saveBuffer.views })
        data.saveBuffer.views.map(saveView)
      }
    }
  }

  return { saveFileBuffer }
}
