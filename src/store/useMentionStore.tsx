import create from 'zustand'

interface Mentionable {
  userid: string
  username: string
  email: string
}

interface MentionStore {
  mentionable: Mentionable[]
  setMentionable: (mentionable: Mentionable[]) => void
}

export const useMentionStore = create<MentionStore>((set) => ({
  mentionable: [],
  setMentionable: (mentionable) =>
    set({
      mentionable
    })
}))
