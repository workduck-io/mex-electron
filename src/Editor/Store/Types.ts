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

export interface InitData {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache
  bookmarks: string[]
  baseNodeId: string
}

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache
  baseNodeId: string
  bookmarks: string[]

  initializeDataStore: (initData: InitData) => void

  addTag: (tag: string) => void
  addILink: (ilink: string, uid?: string, parentId?: string) => string
  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ILink[]) => void
  setBaseNodeId: (baseNodeId: string) => void
  addBookmarks: (bookmarks: string[]) => void
  removeBookamarks: (bookmarks: string[]) => void
  setBookmarks: (bookmarks: string[]) => void
  getBookmarks: () => string[]

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
