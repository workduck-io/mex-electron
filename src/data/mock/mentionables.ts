import { Mentionable } from '../../types/mentions'

const randomUser = (s: string) => ({
  userid: `USER_${s}`,
  username: s,
  email: `${s}@gmail.com`,
  access: 'manage' as const
})

const randomUsers = ['alice', 'bob', 'charlie', 'dave', 'xypnox']

export const mentionables: Mentionable[] = randomUsers.map(randomUser)
