import { useEditorStore } from '@store/useEditorStore'
import { useEffect } from 'react'

export const useGlobalListener = () => {
  const setIsUserTyping = useEditorStore((store) => store.setIsEditing)

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return

      setIsUserTyping(true)
    }

    window.addEventListener('keydown', keyboardHandler)

    return () => {
      return window.removeEventListener('keydown', keyboardHandler)
    }
  }, [])

  useEffect(() => {
    const mouseHandler = () => {
      setIsUserTyping(false)
    }

    window.addEventListener('mousemove', mouseHandler)

    return () => window.removeEventListener('mousemove', mouseHandler)
  }, [])
}
