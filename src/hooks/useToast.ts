import { IpcAction } from '@data/IpcAction'
import { appNotifierWindow } from '@electron/utils/notifiers'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import showToast from 'react-hot-toast'

import { AppType } from '../types/Types'
import { ToastStatus } from '../types/toast'

export const useToast = () => {
  const isSpotlight = useSpotlightContext()
  const appType = isSpotlight ? AppType.SPOTLIGHT : AppType.MEX

  const toast = (message: string | JSX.Element, status: ToastStatus = ToastStatus.SUCCESS, native?: boolean) => {
    if (native || isSpotlight) {
      appNotifierWindow(IpcAction.SHOW_TOAST, appType, {
        status,
        title: message
      })
    } else {
      showToast(message, { duration: 5000 })
    }
  }

  return {
    toast
  }
}
