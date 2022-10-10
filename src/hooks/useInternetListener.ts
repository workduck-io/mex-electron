import { useEffect } from 'react'

import { mog } from '@utils/lib/mog'

import { useJobQueue } from './useQueue'

export const useInternetListener = () => {
  const { setIsQueueEnabled } = useJobQueue()

  const onAppOffline = () => {
    setIsQueueEnabled(true)
    mog('offline')
  }

  const onAppOnline = () => {
    setIsQueueEnabled(false)
    mog('online')
  }

  useEffect(() => {
    window.addEventListener('offline', onAppOffline)
    window.addEventListener('online', onAppOnline)

    return () => {
      window.removeEventListener('offline', onAppOffline)
      window.removeEventListener('online', onAppOnline)
    }
  }, [])
}
