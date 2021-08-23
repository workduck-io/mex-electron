import { IComboboxItem } from '../combobox/components/Combobox.types'

export type Command = 'webem' | 'sync'

export interface SlashCommandConfig {
  command: Command
  slateElementType: string

  // Additional default optional data to be added to the element being inserted
  options?: any // eslint-disable-line @typescript-eslint/no-explicit-any

  // Additional data to be inserted on node creation is fetched from this function
  // The element is a Combobox Item
  getBlockData?: (el: IComboboxItem) => Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}
