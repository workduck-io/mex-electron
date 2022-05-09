import { useMentionStore } from '@store/useMentionStore'

export const useMentions = () => {
  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.username
    } else return undefined
  }

  return { getUsernameFromUserid }
}
