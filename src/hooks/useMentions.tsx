import { useMentionStore } from '@store/useMentionStore'
import { Mentionable } from '../types/mentions'

export const useMentions = () => {
  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.username
    } else return undefined
  }

  const getUserFromUserid = (userid: string): Mentionable | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user
    } else return undefined
  }

  return { getUsernameFromUserid, getUserFromUserid }
}
