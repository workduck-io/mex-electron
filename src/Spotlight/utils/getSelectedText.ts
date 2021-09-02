import { clipboard } from 'electron'
import { keyTap } from 'robotjs'
import activeWindow from 'active-win'

export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

export const getSelectedText = async () => {
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
