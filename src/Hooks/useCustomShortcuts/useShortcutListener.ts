import { useHelpStore } from './../../Components/Help/HelpModal'
import { useEffect, useCallback } from 'react'
import { useShortcutStore } from '../../Editor/Store/ShortcutStore'

export type ShortcutListner = {
  shortcut: string
}

export type Key = {
  name: string
  code: string
  keyCode: number
  isModifier: boolean
}

const useShortcutListener = (): ShortcutListner => {
  const shortcuts = useHelpStore((state) => state.shortcuts)
  const shortcut = useShortcutStore((state) => state.keybinding)
  const setWithModifier = useShortcutStore((state) => state.setWithModifier)
  const addInShortcut = useShortcutStore((state) => state.addInShortcut)

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    setWithModifier(false)
  }, [])

  const getKeyModifiers = (event: KeyboardEvent) => {
    return event.altKey || event.ctrlKey || event.shiftKey || event.metaKey
  }

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const key: Key = {
      name: event.key,
      code: event.code,
      keyCode: event.keyCode,
      isModifier: getKeyModifiers(event)
    }

    addInShortcut(key)
  }, [])

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  return { shortcut }
}

export const useKeyListener = () => {
  const shortcutDisabled = useShortcutStore((state) => state.editMode)

  return { shortcutDisabled }
}

export default useShortcutListener
