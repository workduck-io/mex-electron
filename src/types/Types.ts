/*
 * Specific to comboboxes
 */
export interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string
  text: string
  value: string
  icon?: string
}

/**  ~~ILinks~~ (Node)
 * Map of path -> heirarchal id, with nodeid -> Unique nanoid */
export interface ILink {
  /** Unique Identifier */
  nodeid: string

  /** The title of the node.
   * Uses separator for heirarchy */
  path: string

  /** Iconify Icon string */
  icon?: string
}

/**  Tags */
export interface Tag {
  value: string
}

export interface SlashCommand {
  command: string
  icon?: string
}

export type LinkCache = Record<string, CachedILink[]>
export type TagsCache = Record<string, CacheTag>

export interface InitData {
  tags: Tag[]
  ilinks: ILink[]
  slashCommands: SlashCommand[]
  linkCache: LinkCache
  tagsCache: TagsCache
  bookmarks: string[]
  archive: ILink[]
  baseNodeId: string
}

export interface DataStoreState {
  tags: Tag[]
  ilinks: ILink[]
  slashCommands: SlashCommand[]
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  archive: ILink[]

  initializeDataStore: (initData: InitData) => void

  // adds the node
  addILink: (ilink: string, nodeid?: string, parentId?: string, archived?: boolean) => string

  // adds tag for combobox
  addTag: (tag: string) => void

  setSlashCommands: (slashCommands: SlashCommand[]) => void
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
  addInternalLink: (ilink: CachedILink, nodeid: string) => void
  removeInternalLink: (ilink: CachedILink, nodeid: string) => void
  updateInternalLinks: (links: CachedILink[], nodeid: string) => void

  addInArchive: (archive: ILink[]) => void
  unArchive: (archive: ILink) => void
  removeFromArchive: (archive: ILink[]) => void
  setArchive: (archive: ILink[]) => void
}

export type NodeEditorContent = any[] // eslint-disable-line @typescript-eslint/no-explicit-any

export interface CachedILink {
  // ILink from/to path
  type: 'from' | 'to'
  nodeid: string
}

export interface CacheTag {
  nodes: string[]
}
