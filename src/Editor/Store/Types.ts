export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string
  text: string
  value: string
}

export type LinkCache = Record<string, ILink[]>

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ComboText[]
  slashCommands: ComboText[]
  linkCache: LinkCache

  initializeDataStore: (tags: ComboText[], ids: ComboText[], slash_commands: ComboText[], linkCache: LinkCache) => void

  addTag: (tag: string) => void
  addILink: (ilink: string) => void
  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ComboText[]) => void

  addInternalLink: (ilink: ILink, nodeId: string) => void
  removeInternalLink: (ilink: ILink, nodeId: string) => void
  updateInternalLinks: (links: ILink[], nodeId: string) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ILink {
  // ILink from/to nodeId
  type: 'from' | 'to'
  nodeId: string
}
