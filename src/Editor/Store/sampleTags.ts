import { nanoid } from 'nanoid'
import { ComboText, ILink } from './Types'

export const generateComboText = (tag: string, value: number): ComboText => ({
  key: tag,
  text: tag,
  value: String(value)
})

export const generateIlink = (nodeId: string, value: number): ILink => ({
  key: nodeId,
  text: nodeId,
  value: String(value),
  id: nanoid()
})

export const generateComboTexts = (items: string[]) => items.map(generateComboText)
export const generateILinks = (items: string[]) => items.map(generateIlink)
