type AccessLevel = 'manage' | 'edit' | 'view'

export interface Mentionable {
  userid: string
  username: string
  email: string
  access: AccessLevel
}
