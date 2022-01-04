import React, { useEffect } from 'react'
import { AUTO_SAVE_INTERVAL } from '../Conf/times'
import { useSaveQ, useQStore } from '../Hooks/useQ'

const AutoSave = () => {
  const { saveQ } = useSaveQ()

  useEffect(() => {
    console.log('Setting intervals is cool')
    const interval = setInterval(() => {
      const q = useQStore.getState().q
      console.log('From the interval', { q })

      if (q.length > 0) {
        console.log('This should save now', q)
        saveQ()
      }
    }, AUTO_SAVE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return <></>
}

export default AutoSave
