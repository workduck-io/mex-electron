import { useMentionStore } from '@store/useMentionStore'
import { AccessLevel, Mentionable } from '../types/mentions'

export const useMentions = () => {
  const addInvitedUser = useMentionStore((s) => s.addInvitedUser)
  const addAccess = useMentionStore((s) => s.addAccess)

  // Add access level that is returned from the backend after permissions have been given
  const inviteUser = (email: string, alias: string, nodeid: string, accessLevel: AccessLevel) => {
    const invited = useMentionStore.getState().invitedUsers
    const user = invited.find((u) => u.email === email)

    // if previously invited, update access level
    if (user) {
      addAccess(user.email, nodeid, accessLevel)
    } else {
      addInvitedUser({ email, alias, access: { [nodeid]: accessLevel } })
    }
  }

  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.alias
    } else return undefined
  }

  const getUserFromUserid = (userid: string): Mentionable | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user
    } else return undefined
  }

  return { getUsernameFromUserid, getUserFromUserid, inviteUser }
}
