import { Mentionable } from '../types/mentions'
import create from 'zustand'
import { mentionables } from '@data/mock/mentionables'

interface MentionStore {
  mentionable: Mentionable[]
  setMentionable: (mentionable: Mentionable[]) => void
}

export const useMentionStore = create<MentionStore>((set) => ({
  mentionable: mentionables,
  setMentionable: (mentionable) =>
    set({
      mentionable
    })
}))

export const getUserFromUseridHookless = (userid: string) => {
  const mentionable = useMentionStore.getState().mentionable

  const user = mentionable.find((user) => user.userid === userid)

  if (user) return user
}
