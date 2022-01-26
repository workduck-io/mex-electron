import { generateNodeUID } from '../data/Defaults/idPrefixes'
import { ComboText, ILink, SlashCommand } from '../types/Types'

export const generateComboText = (item: string, value: number): ComboText => ({
  key: item,
  text: item,
  value: String(value)
})

export const generateIconComboText = (item: IconComboText, value: number): ComboText => ({
  key: item.text,
  text: item.text,
  icon: item.icon,
  value: String(value)
})

export const generateIlink = (nodeId: string): ILink => ({
  nodeId,
  uid: generateNodeUID()
})

export const generateComboTexts = (items: string[]) => items.map(generateComboText)
export const generateILinks = (items: string[]) => items.map(generateIlink)

export interface IconComboText {
  text: string
  icon: string
}

export const generateIconComboTexts = (items: IconComboText[]) => items.map(generateIconComboText)
export const addIconToString = (items: string[], icon: string) => items.map((i) => ({ text: i, icon }))

export const addIconToSlashCommand = (items: SlashCommand[], icon: string) =>
  items.map((i: SlashCommand): SlashCommand => ({ ...i, icon }))

/*
 * Function to generate combotexts with value as the number in string.
 */
export const generatorCombo = <T, K>(
  vals: T[],
  transform: (i: T) => K | T = (i) => i,
  addIndexAsValue: boolean | undefined = true
) => {
  return vals.map(transform).map((k, i) => {
    if (addIndexAsValue) return { ...k, value: String(i) }
    return k
  })
}
