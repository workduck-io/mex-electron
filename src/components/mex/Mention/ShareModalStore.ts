import create from 'zustand'
import { AccessLevel, InvitedUser, Mentionable } from '../../../types/mentions'

// The invite mode is only when the editor is open and used to open on new combobox invite
type ShareModalMode = 'invite' | 'permission'

// To denote what has changed
// Alias changes should not require a network call
type UserChange = 'permission' | 'alias' | 'revoke'

interface ChangedUser extends Mentionable {
  change: UserChange[]
}

interface ChangedInvitedUser extends InvitedUser {
  change: UserChange[]
}

export interface EmailOption {
  value: string
  label: string
  error?: boolean
  // Added by the select library indicating
  // if this is a new created field
  __isNew__?: boolean
}

export interface InviteModalData {
  alias: string
  email: string
  access: {
    value: AccessLevel | 'NONE'
    label: string
  }
}

export interface MultiInviteModalData {
  alias: string
  email: EmailOption[]
  access: {
    value: AccessLevel | 'NONE'
    label: string
  }
}
interface ShareModalData {
  // Used only for share permissions mode
  nodeid?: string

  alias?: string

  fromEditor?: boolean
  // When sharing to a preexisting user from a mention
  userid?: string
  changedUsers?: ChangedUser[]
  changedInvitedUsers?: ChangedInvitedUser[]
}

interface ShareModalState {
  open: boolean
  focus: boolean
  mode: ShareModalMode
  data: ShareModalData
  openModal: (mode: ShareModalMode, nodeid?: string) => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  setChangedUsers: (users: ChangedUser[]) => void
  setChangedInvitedUsers: (users: ChangedInvitedUser[]) => void
  prefillModal: (mode: ShareModalMode, data: ShareModalData) => void
}

export const useShareModalStore = create<ShareModalState>((set, get) => ({
  open: false,
  focus: true,
  mode: 'permission',
  data: {
    changedUsers: [],
    changedInvitedUsers: []
  },
  openModal: (mode: ShareModalMode, nodeid) =>
    set({
      mode,
      open: true,
      data: { nodeid }
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false,
      data: {
        changedUsers: [],
        changedInvitedUsers: []
      }
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  setChangedUsers: (users: ChangedUser[]) => set({ data: { changedUsers: users.filter((u) => u.change.length > 0) } }),
  setChangedInvitedUsers: (users: ChangedInvitedUser[]) =>
    set({ data: { changedInvitedUsers: users.filter((u) => u.change.length > 0) } }),
  prefillModal: (mode: ShareModalMode, data) =>
    set({
      mode,
      open: true,
      data: {
        ...get().data,
        ...data
      },
      focus: false
    })
}))
