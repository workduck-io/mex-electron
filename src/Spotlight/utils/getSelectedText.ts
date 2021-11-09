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
  const contentBackup = clipboard.readText('selection')
  console.log('Read Content as: ', contentBackup)
  clipboard.clear()
  simulateCopy()
  const windowDetails = await activeWindow()

  const selectedText = clipboard.readHTML()
  clipboard.writeText(contentBackup)
  console.log('selected text: ', selectedText)

  const ret = {
    text: selectedText,
    metadata: windowDetails
  }
  console.log('Returning: ', ret)
  console.log('\n\n')
  return ret
}

export const getGlobalShortcut = (shortcut: string) => {
  let sh = shortcut.replace('$mod', 'CommandOrControl')
  sh = getKeyFromKeycode(sh)
  return sh
}
