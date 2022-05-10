export interface InvitedUser {
  email: string
  alias: string
  access: AccessMap
}

export type AccessLevel = 'MANAGE' | 'WRITE' | 'READ'

export interface AccessMap {
  [nodeid: string]: AccessLevel
}

export interface Mentionable extends InvitedUser {
  userid: string
}
