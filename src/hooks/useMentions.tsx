import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import useDataStore from '@store/useDataStore'
import { addAccessToUser, useMentionStore } from '@store/useMentionStore'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { mog } from '@utils/lib/mog'

import { UserDetails } from '../types/auth'
import { AccessLevel, DefaultPermission, InvitedUser, Mentionable, SelfMention } from '../types/mentions'
import { useMentionData } from './useLocalData'
import { useNodes } from './useNodes'

export const useMentions = () => {
  const { grantUsersPermission } = usePermission()
  const localUserDetails = useAuthStore((s) => s.userDetails)
  const addInvitedUser = useMentionStore((s) => s.addInvitedUser)
  const addAccess = useMentionStore((s) => s.addAccess)
  const setInvited = useMentionStore((s) => s.setInvited)
  const setMentionable = useMentionStore((s) => s.setMentionable)
  const { isSharedNode } = useNodes()
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

  const saveMentionData = () => {
    setMentionData({
      mentionable: useMentionStore.getState().mentionable,
      invitedUsers: useMentionStore.getState().invitedUsers
    })
  }

  // Used when inserting existing mention/invited to the editor
  const grantUserAccessOnMention = async (alias: string, nodeid: string, access: AccessLevel = DefaultPermission) => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const mentionable = useMentionStore.getState().mentionable
    const currentUserDetails = useAuthStore.getState().userDetails

    const invitedExists = invitedUsers.find((user) => user.alias === alias)
    const mentionExists = mentionable.find((user) => user.alias === alias)

    const mentionPerm = mentionExists && mentionExists.access[nodeid]
    const invitedPerm = invitedExists && invitedExists.access[nodeid]
    mog('GrantUserAccessOnMention', { alias, nodeid, access, mentionPerm, invitedPerm })
    // If the user has permission to node, no need to add it
    if (mentionPerm) return
    if (invitedPerm) return
    if (invitedExists && !mentionExists) {
      const newInvited: InvitedUser = addAccessToUser(invitedExists, nodeid, access)
      // As user not on mex no need to call backend and give permission
      setInvited([...invitedUsers.filter((user) => user.alias !== alias), newInvited])
      return newInvited
    } else if (!invitedExists && mentionExists) {
      // Don't give permission to current user
      if (currentUserDetails.userID === mentionExists.userID) return
      // We know it is guaranteed to be mentionable
      // Call backend and give permission
      const res = await grantUsersPermission(nodeid, [mentionExists.userID], access)
        .then(() => {
          const newMentioned: Mentionable = addAccessToUser(mentionExists, nodeid, access) as Mentionable
          setMentionable([...mentionable.filter((user) => user.alias !== alias), newMentioned])
          saveMentionData()
          return newMentioned
        })
        .catch((e) => {
          console.log('Granting permission to user failed', { e })
          return undefined
        })
      return res
    } else {
      // By design, the user should be in either invited or mentionable. The flow for new created user is different.
      console.error('SHOULD NOT RUN: grantUserAccessOnMention', { alias, nodeid, access })
      return 'notFound'
      //
    }
  }

  const addMentionable = (
    alias: string,
    email: string,
    userID: string,
    name: string,
    nodeid?: string,
    access?: AccessLevel
  ) => {
    // if (userID === localUserDetails.userID) {
    //   mog('Not adding mentionable user as it is the current user', { userID })
    //   return
    // }
    const mentionable = useMentionStore.getState().mentionable

    const mentionExists = mentionable.find((user) => user.userID === userID)

    // mog('adding mentionable user ', { userID, mentionExists, mentionable })
    if (mentionExists) {
      if (nodeid && access) {
        mentionExists.access[nodeid] = access
      }
      setMentionable([...mentionable.filter((u) => u.userID !== userID), mentionExists])
    } else {
      const newMention: Mentionable = {
        type: 'mentionable',
        alias,
        name,
        email,
        access: {
          [nodeid]: access
        },
        userID
      }
      setMentionable([...mentionable, newMention])
    }
  }

  const getUsernameFromUserid = (userid: string): string | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userID === userid)
    if (user) {
      return user.alias
    } else return undefined
  }

  const getUserAccessLevelForNode = (userid: string, nodeid: string): AccessLevel | undefined => {
    const mentionable = useMentionStore.getState().mentionable
    const localUserDetails = useAuthStore.getState().userDetails
    const user = mentionable.find((mention) => mention.userID === userid)
    if (user && user.access[nodeid]) {
      return user.access[nodeid]
    }
    const sharedNodes = useDataStore.getState().sharedNodes
    const sharedNode = sharedNodes.find((node) => node.nodeid === nodeid)
    if (userid === localUserDetails?.userID) {
      if (sharedNode) {
        return sharedNode.currentUserAccess
      } else {
        return 'OWNER'
      }
    }

    // const isShared = isSharedNode(nodeid)
    return undefined
  }

  const getSharedUsersForNode = (nodeid: string): Mentionable[] => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable
      .filter((mention) => mention.access[nodeid] !== undefined)
      // Get the owner to the top
      .sort((a, b) => (a.access[nodeid] === 'OWNER' ? -1 : b.access[nodeid] === 'OWNER' ? 1 : 0))

    return users
  }

  const getInvitedUsersForNode = (nodeid: string): InvitedUser[] => {
    const invitedUsers = useMentionStore.getState().invitedUsers
    const users = invitedUsers.filter((mention) => mention.access[nodeid] !== undefined)
    return users
  }
  const getSharedUsersOfNodeOfSpace = (nodeid: string, spaceId: string) => {
    const mentionable = useMentionStore.getState().mentionable
    const users = mentionable
      .filter((mention) => {
        const access = mention.access

        return access.note[nodeid] !== undefined || access.space[spaceId] !== undefined
      })
      .sort((a, b) => (a.access.note[nodeid] === 'OWNER' ? -1 : b.access.note[nodeid] === 'OWNER' ? 1 : 0))
    return users
  }
  const getUserFromUserid = (userid: string): Mentionable | InvitedUser | SelfMention | undefined => {
    const currentUser = useAuthStore.getState().userDetails
    if (currentUser.userID === userid) {
      return {
        type: 'self',
        ...currentUser
      }
    }
    const mentionable = useMentionStore.getState().mentionable
    const user = mentionable.find((mention) => mention.userID === userid)
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
    const cache = useUserCacheStore.getState().cache
    const userFromCache = cache.find((u) => u.userID === userid)
    if (userFromCache) {
      return { ...userFromCache, type: 'mentionable', access: {} }
    }
    return undefined
  }

  const applyChangesMentionable = (
    newPermissions: { [userid: string]: AccessLevel },
    newAliases: { [userid: string]: string },
    revoked: string[],
    nodeid: string
  ) => {
    mog('applyChanges', { newPermissions, newAliases, revoked })

    const oldMentionable = useMentionStore.getState().mentionable

    const afterRevoked = oldMentionable.map((u) => {
      if (revoked.includes(u.userID)) {
        delete u.access[nodeid]
        return u
      }
      return u
    })
    const afterAliasChange = afterRevoked.map((u) => {
      if (Object.keys(newAliases).includes(u.userID)) return { ...u, alias: newAliases[u.userID] }
      return u
    })
    const afterAccessChange = afterAliasChange.map((u) => {
      if (Object.keys(newPermissions).includes(u.userID))
        return {
          ...u,
          access: {
            ...u.access,
            [nodeid]: newPermissions[u.userID]
          }
        }
      return u
    })

    mog('AfterApplying the changes', { oldMentionable, afterRevoked, afterAliasChange, afterAccessChange })

    setMentionable(afterAccessChange)
  }

  return {
    getUsernameFromUserid,
    getUserFromUserid,
    inviteUser,
    addMentionable,
    getUserAccessLevelForNode,
    getSharedUsersForNode,
    getSharedUsersOfNodeOfSpace,
    getInvitedUsersForNode,
    grantUserAccessOnMention,
    applyChangesMentionable,
    saveMentionData
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
