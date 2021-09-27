export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string
  text: string
  value: string
}

export interface ILink extends ComboText {
  id: string
}

export type LinkCache = Record<string, CachedILink[]>

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache

  initializeDataStore: (tags: ComboText[], ids: ILink[], slash_commands: ComboText[], linkCache: LinkCache) => void

  addTag: (tag: string) => void
  addILink: (ilink: string) => void
  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ILink[]) => void

  addInternalLink: (ilink: CachedILink, nodeId: string) => void
  removeInternalLink: (ilink: CachedILink, nodeId: string) => void
  updateInternalLinks: (links: CachedILink[], nodeId: string) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any

export interface CachedILink {
  // ILink from/to nodeId
  type: 'from' | 'to'
  nodeId: string
}
