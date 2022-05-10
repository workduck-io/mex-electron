export interface IUser {
  email: string
  alias: string
  access: AccessMap
}

export interface InvitedUser extends IUser {
  type: 'invite'
}

export type AccessLevel = 'MANAGE' | 'WRITE' | 'READ'

export const permissionOptions: {
  value: AccessLevel
  label: string
}[] = [
  { value: 'MANAGE', label: 'Manage' },
  { value: 'WRITE', label: 'Edit' },
  { value: 'READ', label: 'View' }
]

export interface AccessMap {
  [nodeid: string]: AccessLevel
}

export interface Mentionable extends IUser {
  type: 'mentionable'
  userid: string
}
