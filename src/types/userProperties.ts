export enum LastOpenedState {
  UNREAD = 'unread',
  OPENED = 'opened',
  MUTED = 'muted'
}

/**
 * Last opened note details
 */
export interface LastOpenedNote {
  nodeid: string

  /** Number of times opened */
  freq: number

  /** Timestamp when last opened */
  timestamp: number

  /** Whether the note is muted */
  muted: boolean
}

/**
 * Last opened note mapped to their nodeid
 */
export interface LastOpenedNotes {
  [key: string]: LastOpenedNote
}

export interface UserProperties {
  lastOpenedNotes: LastOpenedNotes
  /** Current mex Theme */
  theme?: string
}
