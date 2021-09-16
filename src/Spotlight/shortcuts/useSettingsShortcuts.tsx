import { useEffect } from 'react'
import { useContentStore } from '../../Editor/Store/ContentStore'
import tinykeys from 'tinykeys'

export const useSettingsShortcuts = () => {
  const setSaved = useContentStore((state) => state.setSaved)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+s': (event) => {
        setSaved(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
