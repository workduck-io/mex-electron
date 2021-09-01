export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string
  text: string
  value: string
}

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ComboText[]
  slashCommands: ComboText[]

  initializeDataStore: (tags: ComboText[], ids: ComboText[], slash_commands: ComboText[]) => void

  addTag: (tag: string) => void
  addILink: (ilink: string) => void
  removeILink: (Ilink: string) => void
  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ComboText[]) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any
