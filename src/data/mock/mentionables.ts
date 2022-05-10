import { Mentionable } from '../../types/mentions'

const randomUser = (s: string) => ({
  userid: `USER_${s}`,
  alias: s,
  email: `${s}@gmail.com`,
  access: {}
})

const inviteUser = (s: string) => ({
  alias: s,
  email: `${s}@gmail.com`,
  access: {}
})

const randomUsers = ['alice', 'bob', 'charlie', 'dave', 'xypnox']

const invitedUsers = ['zavier', 'xavoier', 'yavoier', 'zavoier']

export const invited = invitedUsers.map(inviteUser)

export const mentionables: Mentionable[] = randomUsers.map(randomUser)
