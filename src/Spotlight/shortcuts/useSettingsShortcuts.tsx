import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useContentStore } from '../../Editor/Store/ContentStore'
import tinykeys from 'tinykeys'
import { useSpotlightSettingsStore } from '../store/settings'

export const useSettingsShortcuts = () => {
  const history = useHistory()
  const setSaved = useContentStore((state) => state.setSaved)
  const setBackPressed = useSpotlightSettingsStore((state) => state.setBackPressed)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        setBackPressed(true)
        history.go(-1)
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
