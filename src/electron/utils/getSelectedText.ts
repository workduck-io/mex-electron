import { clipboard } from 'electron'
import { keyTap, setKeyboardDelay, keyToggle } from 'robotjs'
import activeWindow from 'active-win-universal'
import { getKeyFromKeycode } from '../../Lib/keyMap'

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}
export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

// * For windows
export const getSelectedTextSync = () => {
  setKeyboardDelay(100)
  const contentBackup = clipboard.readText()
  clipboard.clear()
  keyToggle('shift', 'down')
  keyTap('c', 'control')

  const selectedText = clipboard.readHTML()
  clipboard.writeText(contentBackup)

  const ret = {
    text: selectedText,
    metadata: activeWindow.sync()
  }
  return ret
}

export const getSelectedText = async (): Promise<SelectionType> => {
  const contentBackup = clipboard.readText()
  clipboard.clear()
  simulateCopy()
  const windowDetails = await activeWindow()

  const selectedText = clipboard.readHTML()
  clipboard.writeText(contentBackup)

  return {
    text: selectedText,
    metadata: windowDetails
  }
}

export const getPermissions = async () => {
  simulateCopy()
  clipboard.clear()
  await activeWindow()
}

export const getGlobalShortcut = (shortcut: string) => {
  let sh = shortcut.replace('$mod', 'CommandOrControl')
  sh = getKeyFromKeycode(sh)
  return sh
}
