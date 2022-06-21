import { mog } from '@utils/lib/helper'
import { useEffect } from 'react'
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
