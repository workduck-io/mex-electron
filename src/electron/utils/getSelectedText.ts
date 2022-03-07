import { keyTap, keyToggle, setKeyboardDelay } from 'robotjs'

import activeWindow from 'active-win-universal'
import { clipboard } from 'electron'
import { getKeyFromKeycode } from '../../utils/lib/keyMap'
import { mog } from '../../utils/lib/helper'

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}
export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')
export const simulatePaste = () => keyTap('v', process.platform === 'darwin' ? 'command' : 'control')

// * For windows
export const getSelectedTextSync = () => {
  setKeyboardDelay(100)
  const contentBackup = clipboard.readHTML()
  clipboard.clear()
  keyToggle('shift', 'down')
  keyTap('c', 'control')

  const selectedText = clipboard.readHTML()
  clipboard.writeHTML(contentBackup)

  const ret = {
    text: selectedText,
    metadata: activeWindow.sync()
  }
  return ret
}

export const getSelectedText = async (): Promise<SelectionType> => {
  const contentBackup = clipboard.readHTML()

  clipboard.clear()
  simulateCopy()

  const windowDetails = await activeWindow()

  const selectedText = clipboard.readHTML()
  clipboard.writeHTML(contentBackup)

  return {
    text: selectedText,
    metadata: windowDetails
  }
}

export const copyToClipboard = (text: string, html: string) => {
  clipboard.write({ text, html })
}

export const useSnippetFromClipboard = (text: string, html: string) => {
  // const contentBackup = clipboard.readText()
  // clipboard.clear()
  copyToClipboard(text, html)

  setTimeout(() => {
    simulatePaste()
    // clipboard.writeText(contentBackup)
  }, 1000)
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
