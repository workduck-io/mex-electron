import { generateNodeUID } from '../data/Defaults/idPrefixes'
import { ILink, SlashCommand, Tag } from '../types/Types'

export const generateTag = (item: string): Tag => ({
  value: item
})

export const generateIlink = (nodeId: string): ILink => ({
  nodeId,
  uid: generateNodeUID()
})

export const generateILinks = (items: string[]) => items.map(generateIlink)

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
