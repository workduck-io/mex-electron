export interface IUser {
  email: string
  alias: string
  access: AccessMap
}

export interface InvitedUser extends IUser {
  type: 'invite'
}

export type AccessLevel = 'MANAGE' | 'WRITE' | 'READ'

export interface AccessMap {
  [nodeid: string]: AccessLevel
}

export interface Mentionable extends IUser {
  type: 'mentionable'
  userid: string
}
