import { AccessLevel } from './mentions'

export enum CategoryType {
  backlink = 'Backlinks',
  action = 'Quick Actions',
  search = 'Search Results',
  performed = 'Performed Actions',
  meeting = 'Meetings',
  task = 'Task'
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  snippet = 'Snippets',
  flow = 'Flows',
  tags = 'Tags',
  mentions = 'Mentions'
}

type UserID = string

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

// M stands for Multi/Mex/Many (yet to decide)
export interface MIcon {
  type: 'URL' | 'ICON' | 'EMOJI'
  value: string
}

export interface CheckValidILinkProps {
  notePath: string
  openedNotePath?: string
  showAlert?: boolean
  namespace?: string
}

/**  ~~ILinks~~ (Node)
 * Map of path -> heirarchal id, with nodeid -> Unique nanoid */
export interface ILink {
  /** Unique Identifier */
  nodeid: string

  /** The title of the node.
   * Uses separator for heirarchy */
  path: string

  namespace: string

  /** Iconify Icon string */
  icon?: string

  createdAt?: number
  updatedAt?: number

  parentNodeId?: string
}

export type NewILinkProps = {
  openedNotePath?: string
  content?: NodeEditorContent
  showAlert?: boolean
}

export interface SharedNode extends ILink {
  currentUserAccess: AccessLevel
  sharedBy: UserID
  owner: UserID
}

export type ILinksMetadata = Record<string, any>

/**  Tags */
export interface Tag {
  value: string
}

export interface SlashCommand {
  command: string
  text?: string
  icon?: string
  type?: QuickLinkType | CategoryType
  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
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
  archive?: ILink[]
  baseNodeId: string
  sharedNodes: SharedNode[]
}

interface SlashCommands {
  default: SlashCommand[]
  internal: SlashCommand[]
}

export interface AddILinkProps {
  ilink: string
  namespace: string
  nodeid?: string
  openedNotePath?: string
  archived?: boolean
  showAlert?: boolean
}

export interface SingleNamespace {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  icon?: MIcon
}

export interface DataStoreState {
  tags: Tag[]
  ilinks: ILink[]
  slashCommands: SlashCommands
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  sharedNodes: SharedNode[]
  archive?: ILink[]
  initialized: boolean

  initializeDataStore: (initData: InitData) => void

  // Namespaces
  namespaces: SingleNamespace[]
  setNamespaces: (namespaces: SingleNamespace[]) => void
  addNamespace: (namespace: SingleNamespace) => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined
  checkValidILink: (props: CheckValidILinkProps) => string

  // adds tag for combobox
  addTag: (tag: string) => void
  setTags: (tags: Tag[]) => void

  setSlashCommands: (slashCommands: SlashCommands) => void
  setIlinks: (ilinks: ILink[]) => void
  setBaseNodeId: (baseNodeId: string) => void

  // Bookmarks
  addBookmarks: (bookmarks: string[]) => void
  removeBookamarks: (bookmarks: string[]) => void
  setBookmarks: (bookmarks: string[]) => void
  getBookmarks: () => string[]

  // Shared Nodes
  setSharedNodes: (sharedNodes: SharedNode[]) => void
  getSharedNodes: () => SharedNode[]

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

export enum NodeType {
  DEFAULT,
  SHARED,
  ARCHIVED,
  MISSING,
  SNIPPET
}
