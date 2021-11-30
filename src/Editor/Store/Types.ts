import { NodeProperties } from './EditorStore'

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
export type TagsCache = Record<string, CacheTag>

export interface InitData {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache
  tagsCache: TagsCache
  bookmarks: string[]
  archive: ILink[]
  baseNodeId: string
}

export interface DataStoreState {
  tags: ComboText[]
  ilinks: ILink[]
  slashCommands: ComboText[]
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  archive: ILink[]

  initializeDataStore: (initData: InitData) => void

  // adds the node
  addILink: (ilink: string, uid?: string, parentId?: string, archived?: boolean) => string

  // adds tag for combobox
  addTag: (tag: string) => void

  setSlashCommands: (slashCommands: ComboText[]) => void
  setIlinks: (ilinks: ILink[]) => void
  setBaseNodeId: (baseNodeId: string) => void

  // Bookmarks
  addBookmarks: (bookmarks: string[]) => void
  removeBookamarks: (bookmarks: string[]) => void
  setBookmarks: (bookmarks: string[]) => void
  getBookmarks: () => string[]

  // Tags Cache
  updateTagCache: (tag: string, nodes: string[]) => void
  updateTagsCache: (tagsCache: TagsCache) => void

  // Internal Links Cache
  // adds the link between nodes
  addInternalLink: (ilink: CachedILink, uid: string) => void
  removeInternalLink: (ilink: CachedILink, uid: string) => void
  updateInternalLinks: (links: CachedILink[], uid: string) => void

  addInArchive: (archive: ILink[]) => void
  unArchive: (archive: ILink) => void
  removeFromArchive: (archive: ILink[]) => void
  setArchive: (archive: ILink[]) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any

export interface CachedILink {
  // ILink from/to nodeId
  type: 'from' | 'to'
  uid: string
}

export interface CacheTag {
  nodes: string[]
}
