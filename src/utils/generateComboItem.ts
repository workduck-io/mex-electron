import { generateNodeId } from '../data/Defaults/idPrefixes'
import { ComboText, ILink } from '../types/Types'

export const generateComboText = (tag: string, value: number): ComboText => ({
  key: tag,
  text: tag,
  value: String(value)
})

export const generateIconComboText = (tag: IconComboText, value: number): ComboText => ({
  key: tag.text,
  text: tag.text,
  icon: tag.icon,
  value: String(value)
})

export const generateIlink = (nodeId: string, value: number): ILink => ({
  key: nodeId,
  text: nodeId,
  value: String(value),
  uid: generateNodeId()
})

export const generateComboTexts = (items: string[]) => items.map(generateComboText)
export const generateILinks = (items: string[]) => items.map(generateIlink)

export interface IconComboText {
  text: string
  icon: string
}

export const generateIconComboTexts = (items: IconComboText[]) => items.map(generateIconComboText)
export const addIconToString = (items: string[], icon: string) => items.map((i) => ({ text: i, icon }))
