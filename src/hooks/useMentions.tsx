import { usePermission } from '@services/auth/usePermission'
import { addAccessToUser, useMentionStore } from '@store/useMentionStore'
import { mog } from '@utils/lib/helper'
import { AccessLevel, DefaultPermission, InvitedUser, Mentionable } from '../types/mentions'
import { useMentionData } from './useLocalData'

export const useMentions = () => {
  const { grantUsersPermission } = usePermission()
  const addInvitedUser = useMentionStore((s) => s.addInvitedUser)
  const addAccess = useMentionStore((s) => s.addAccess)
  const setInvited = useMentionStore((s) => s.setInvited)
  const setMentionable = useMentionStore((s) => s.setMentionable)
  const { setMentionData } = useMentionData()

  // Add access level that is returned from the backend after permissions have been given
  const inviteUser = (email: string, alias: string, nodeid: string, accessLevel: AccessLevel) => {
    const invited = useMentionStore.getState().invitedUsers
    const user = invited.find((u) => u.email === email)

    // if previously invited, update access level
    if (user) {
      addAccess(user.email, nodeid, accessLevel)
    } else {
      addInvitedUser({ type: 'invite', email, alias, access: { [nodeid]: accessLevel } })
    }

    setMentionData({
      mentionable: useMentionStore.getState().mentionable,
      invitedUsers: useMentionStore.getState().invitedUsers
    })
  }

  const grantUserAccessOnMention = (alias: string, nodeid: string, access: AccessLevel = DefaultPermission) => {
    mog('GrantUserAccessOnMention', { alias, nodeid, access })

    const invitedUsers = useMentionStore.getState().invitedUsers
    const mentionable = useMentionStore.getState().mentionable
    const invitedExists = invitedUsers.find((user) => user.alias === alias)
    const mentionExists = mentionable.find((user) => user.alias === alias)
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, nodeid, access)
      // As user not on mex no need to call backend and give permission
      setInvited([...invitedUsers.filter((user) => user.alias !== alias), newInvited])
      return 'invite'
    } else if (!invitedExists && mentionExists) {
      // We know it is guaranteed to be mentionable
      // Call backend and give permission
      const res = grantUsersPermission(nodeid, [mentionExists.userid], access)
        .then(() => {
          const newMentioned: Mentionable = addAccessToUser(mentionExists, nodeid, access) as Mentionable
          setMentionable([...mentionable.filter((user) => user.email !== alias), newMentioned])
          return 'mentionable'
        })
        .catch((e) => {
          console.log('Granting permission to user failed', { e })
          return 'error'
        })
      return res
    } else {
      // By design, the user should be in either invited or mentionable. The flow for new created user is different.
      console.log('SHOULD NOT RUN', {})
      return 'notFound'
      //
    }
  }

  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.alias
    } else return undefined
  }

  const getUserAccessLevelForNode = (userid: string, nodeid: string): AccessLevel | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user.access[nodeid]
    } else return undefined
  }

  const getSharedUsersForNode = (nodeid: string): Mentionable[] => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable.filter((mention) => mention.access[nodeid] !== undefined)
    return users
  }

  const getInvitedUsersForNode = (nodeid: string): InvitedUser[] => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const users = invitedUsers.filter((mention) => mention.access[nodeid] !== undefined)
    return users
  }

  const getUserFromUserid = (userid: string): Mentionable | InvitedUser | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userid === userid)
    if (user) {
      return user
    } else {
      // If the user is invited only, the userid is the alias
      const invited = useMentionStore.getState().invitedUsers
      const invitedUser = invited.find((u) => u.alias === userid)
      if (invitedUser) {
        return invitedUser
      }
    }
    return undefined
  }

  return {
    getUsernameFromUserid,
    getUserFromUserid,
    inviteUser,
    getUserAccessLevelForNode,
    getSharedUsersForNode,
    getInvitedUsersForNode,
    grantUserAccessOnMention
  }
}

export const getAccessValue = (access: AccessLevel): { value: AccessLevel; label: string } => {
  switch (access) {
    case 'READ':
      return { value: 'READ', label: 'View' }
    case 'WRITE':
      return { value: 'WRITE', label: 'Edit' }
    case 'MANAGE':
      return { value: 'MANAGE', label: 'Manage' }
    default:
      return { value: 'MANAGE', label: 'Manage' }
  }
}
