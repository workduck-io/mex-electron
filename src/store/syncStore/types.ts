export enum BroadcastSyncedChannel {
  CONTENTS = 'contents',
  RECENTS = 'recents',
  SNIPPETS = 'snippets',
  ACTIONS = 'actions',
  TASKS = 'tasks',
  DATA = 'data',
  AUTH = 'auth',
  DWINDLE = 'dwindle',
  EDITOR = 'editor',
  MENTIONS = 'mentions',
  REMINDERS = 'reminders',
  THEME = 'theme',
  TOKEN_DATA = 'token-data',
  USER_PROPERTIES = 'user-properties'
}

export type SyncField<Field> = {
  field: Field
  atomicField?: string
}

export type PartialSyncStateType = {
  state: any
  atomicField?: string
}

export type SyncMessageType = {
  updatedAt: number
  state: PartialSyncStateType
}
