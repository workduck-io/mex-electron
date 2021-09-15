import { useEffect } from 'react'
import { useHistory } from 'react-router'
import tinykeys from 'tinykeys'

export const useResultsShortcuts = () => {
  const history = useHistory()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Tab: (event) => {
        event.preventDefault()
        history.replace('/new')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
