import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import useDataStore from '@store/useDataStore'
import { AccessLevel } from '../types/mentions'
import { mog } from '@utils/lib/helper'
import { useMentions } from './useMentions'
import { getEmailStart } from '@data/Defaults/auth'
import { useAuthStore } from '@services/auth/useAuth'

interface UsersRaw {
  nodeid: string
  users: Record<string, string>
}

interface MUsersRaw {
  nodeid: string
  email: string
  userid: string
  access: AccessLevel
}

export const useFetchShareData = () => {
  const { getAllSharedNodes, getUsersOfSharedNode } = usePermission()
  const { getUserDetailsUserId } = useUserService()
  const { addMentionable } = useMentions()
  const setSharedNodes = useDataStore((s) => s.setSharedNodes)
  const userDetails = useAuthStore((s) => s.userDetails)

  const fetchShareData = async () => {
    // First fetch the shared nodes
    const sharedNodes = await getAllSharedNodes()
    // mog('SharedNode', { sharedNodes })

    setSharedNodes(sharedNodes)

    // Then fetch the users with access to the shared node
    const sharedNodeDetails = sharedNodes.map((node) => {
      return getUsersOfSharedNode(node.nodeid)
    })

    const nodeDetails = await Promise.allSettled(sharedNodeDetails)

    const usersWithAccess = nodeDetails
      .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        return p.value as UsersRaw
      })

    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      // mog('getUserAccess', { p, n })
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ nodeid: n.nodeid, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // Then finally fetch the user detail: email
    const mentionableU = (
      await Promise.allSettled(
        UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email }
        })
      )
    )
      .filter((p) => p.status === 'fulfilled')
      .map((p: any) => p.value as MUsersRaw)
      .filter((u) => u.userid !== userDetails?.userId)

    mentionableU.forEach((u) => addMentionable(getEmailStart(u.email), u.email, u.userid, u.nodeid, u.access))

    mog('SharedNode', { sharedNodes, usersWithAccess, mentionableU, UserAccessDetails })
  }

  return { fetchShareData }
}