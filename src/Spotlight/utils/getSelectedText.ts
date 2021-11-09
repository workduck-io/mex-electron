import { clipboard } from 'electron'
import { keyTap, typeString, setKeyboardDelay, keyToggle } from 'robotjs'
import activeWindow from 'active-win'
import { getKeyFromKeycode } from '../../Lib/keyMap'

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}

export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

export const getSelectedTextSync = () => {
  setKeyboardDelay(100)
  const contentBackup = clipboard.readText()
  console.log('Read Content as: ', contentBackup)
  clipboard.clear()
  keyToggle('shift', 'down')
  keyTap('c', 'control')

  const selectedText = clipboard.readText()
  console.log('selected text: ', selectedText)
  clipboard.writeText(contentBackup)

  const ret = {
    text: selectedText,
    metadata: activeWindow.sync()
  }
  console.log('Text: ', ret.text)
  console.log('Returning: ', ret)
  console.log('\n\n')
  return ret
}

export const getSelectedText = async (): Promise<SelectionType> => {
  setKeyboardDelay(10000)
  const windowDetails = await activeWindow()
  const contentBackup = clipboard.readText()
  console.log('Read Content as: ', contentBackup)
  clipboard.clear()
  keyToggle('shift', 'down')
  keyTap('c', 'control')
  // simulateCopy()

  const selectedText = clipboard.readText()
  console.log('selected text: ', selectedText)
  clipboard.writeText(contentBackup)

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
