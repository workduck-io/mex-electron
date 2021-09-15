import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useContentStore } from '../../Editor/Store/ContentStore'
import tinykeys from 'tinykeys'

export const useSettingsShortcuts = () => {
  const history = useHistory()
  const setSaved = useContentStore((state) => state.setSaved)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        history.replace('/')
      },
      '$mod+s': (event) => {
        setSaved(true)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
