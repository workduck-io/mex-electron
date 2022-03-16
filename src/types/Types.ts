import { QuickLinkType } from '../components/mex/NodeSelect/NodeSelect'
import { SlashType } from '../editor/Components/multi-combobox/types'

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
  type?: QuickLinkType | SlashType
}

export type LinkCache = Record<string, CachedILink[]>
export type TagsCache = Record<string, CacheTag>

export interface InitData {
  tags: Tag[]
  ilinks: ILink[]
  slashCommands: SlashCommands
  linkCache: LinkCache
  tagsCache: TagsCache
  bookmarks: string[]
  archive: ILink[]
  baseNodeId: string
}
interface SlashCommands {
  default: SlashCommand[]
  internal: SlashCommand[]
}

export interface AddILinkProps {
  ilink: string
  nodeid?: string
  parentId?: string
  archived?: boolean
  showAlert?: boolean
}

export interface DataStoreState {
  tags: Tag[]
  ilinks: ILink[]
  slashCommands: SlashCommands
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  archive: ILink[]

  initializeDataStore: (initData: InitData) => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined

  // adds tag for combobox
  addTag: (tag: string) => void

  setSlashCommands: (slashCommands: SlashCommands) => void
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
  updateInternalLinksForNode: (links: CachedILink[], nodeid: string) => void
  updateInternalLinks: (linkCache: LinkCache) => void

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
