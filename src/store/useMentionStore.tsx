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
