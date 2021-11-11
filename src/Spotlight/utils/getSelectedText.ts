import { clipboard } from 'electron'
import { keyTap } from 'robotjs'
import activeWindow from 'active-win'
import { getKeyFromKeycode } from '../../Lib/keyMap'

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}

export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

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

export const getGlobalShortcut = (shortcut: string) => {
  let sh = shortcut.replace('$mod', 'CommandOrControl')
  sh = getKeyFromKeycode(sh)
  return sh
}
