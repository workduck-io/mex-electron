import { useHistory } from 'react-router'
import { useContentStore } from '../../Editor/Store/ContentStore'
import { useSpotlightContext } from '../utils/context'
import tinykeys from 'tinykeys'
import { useEffect } from 'react'

export const useMexItShortcuts = () => {
  const history = useHistory()
  const { setSelection, setSearch } = useSpotlightContext()
  const setSaved = useContentStore((state) => state.setSaved)

  const handleCancel = () => {
    setSaved(false)
    setSearch('')
    setSelection(undefined)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        handleCancel()
        history.replace('/')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
