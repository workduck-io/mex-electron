import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSpotlightSettingsStore } from '../store/settings'
import tinykeys from 'tinykeys'

export const useGlobalShortcuts = () => {
  const history = useHistory()
  const { showSource, toggleSource } = useSpotlightSettingsStore(({ showSource, toggleSource }) => ({
    showSource,
    toggleSource
  }))

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Alt: (event) => {
        event.preventDefault()
        history.replace('/settings')
      },
      '$mod+Shift+,': (event) => {
        toggleSource(!showSource)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [showSource])
}
