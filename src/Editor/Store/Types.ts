export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string
  text: string
  value: string
}

export interface ILink extends ComboText {
  uid: string
}

export type LinkCache = Record<string, CachedILink[]>

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache

  initializeDataStore: (tags: ComboText[], ids: ILink[], slash_commands: ComboText[], linkCache: LinkCache) => void

  addTag: (tag: string) => void
  addILink: (ilink: string, uid?: string) => string
  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ILink[]) => void

  addInternalLink: (ilink: CachedILink, uid: string) => void
  removeInternalLink: (ilink: CachedILink, uid: string) => void
  updateInternalLinks: (links: CachedILink[], uid: string) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any

export interface CachedILink {
  // ILink from/to nodeId
  type: 'from' | 'to'
  uid: string
}
