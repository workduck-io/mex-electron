import { Mentionable } from '../../types/mentions'

const randomUser = (s: string) => ({
  userid: `USER_${s}`,
  username: s,
  email: `${s}@email.com`
})

const randomUsers = ['alice', 'bob', 'charlie', 'dave']

export const mentionables: Mentionable[] = randomUsers.map(randomUser)
