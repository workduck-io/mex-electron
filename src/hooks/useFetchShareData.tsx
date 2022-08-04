import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import useDataStore from '@store/useDataStore'
import { AccessLevel } from '../types/mentions'
import { useMentions } from './useMentions'
import { getEmailStart } from '@data/Defaults/auth'
import { runBatch } from '@utils/lib/batchPromise'

interface UsersRaw {
  nodeid: string
  users: Record<string, string>
}

interface MUsersRaw {
  nodeid: string
  email: string
  alias: string
  name: string
  userid: string
  access: AccessLevel
}

export const useFetchShareData = () => {
  const { getAllSharedNodes, getUsersOfSharedNode } = usePermission()
  const { getUserDetailsUserId } = useUserService()
  const { addMentionable } = useMentions()
  const setSharedNodes = useDataStore((s) => s.setSharedNodes)

  const fetchSharedNodeUsers = async (nodeid: string) => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const node = sharedNodes.find((n) => n.nodeid === nodeid)
    // Then fetch the users with access to the shared node
    //
    if (!node) return
    const sharedNodeDetails = [getUsersOfSharedNode(nodeid)]

    const nodeDetails = (await runBatch(sharedNodeDetails)).fulfilled

    // const nodeUsers =

    const usersWithAccess = nodeDetails
      // .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        // mog('p', { p })
        return p[0].value as UsersRaw
      })

    // mog('getUserAccess', { usersWithAccess, nodeDetails })
    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ nodeid: n.nodeid, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // const sharedNodeOwnerDetails = sharedNodes
    //   .filter((node) => node.owner !== undefined)
    //   .map((node) => {
    //     return getUserDetailsUserId(node.owner)
    //   })
    // Then finally fetch the user detail: email
    const mentionableU = (
      await runBatch([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email, alias: uDetails.alias }
        }),

        ...[node].map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            userid: uDetails.userID,
            nodeid: node.nodeid,
            email: uDetails.email,
            name: uDetails.name,
            alias: uDetails.alias
          }
        })
      ])
    ).fulfilled
      // .filter((p) => p.status === 'fulfilled')
      .reduce((arr, p: any) => {
        // mog('p', { p })
        return [...arr, ...p.map((u) => u.value as MUsersRaw)]
      }, [])
    // .filter((u) => u.userid !== userDetails?.userID)

    // mog('mentionableU', { mentionableU })
    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userid, u.name, u.nodeid, u.access)
    )
  }

  const fetchShareData = async () => {
    // First fetch the shared nodes
    const sharedNodesPreset = await getAllSharedNodes()
    // mog('SharedNode', { sharedNodes })
    //
    if (sharedNodesPreset.status === 'error') return

    const sharedNodes = sharedNodesPreset.data

    setSharedNodes(sharedNodes)

    /*
    // Then fetch the users with access to the shared node
    const sharedNodeDetails = sharedNodes.map((node) => {
      return getUsersOfSharedNode(node.nodeid)
    })

    const nodeDetails = (await runBatch(sharedNodeDetails)).fulfilled

    // const nodeUsers =

    const usersWithAccess = nodeDetails
      // .filter((p) => p.status === 'fulfilled')
      .map((p: any) => {
        return p.value as UsersRaw
      })

    const UserAccessDetails = usersWithAccess.reduce((p, n) => {
      // mog('getUserAccess', { p, n })
      const rawUsers = Object.entries(n.users).map(([uid, access]) => ({ nodeid: n.nodeid, userid: uid, access }))
      return [...p, ...rawUsers]
    }, [])

    // const sharedNodeOwnerDetails = sharedNodes
    //   .filter((node) => node.owner !== undefined)
    //   .map((node) => {
    //     return getUserDetailsUserId(node.owner)
    //   })
    // Then finally fetch the user detail: email
    const mentionableU = (
      await runBatch([
        ...UserAccessDetails.map(async (u) => {
          const uDetails = await getUserDetailsUserId(u.userid)
          return { ...u, email: uDetails.email, alias: uDetails.alias }
        }),

        ...sharedNodes.map(async (node) => {
          const uDetails = await getUserDetailsUserId(node.owner)
          return {
            access: 'OWNER',
            userid: uDetails.userID,
            nodeid: node.nodeid,
            email: uDetails.email,
            name: uDetails.name,
            alias: uDetails.alias
          }
        })
      ])
    ).fulfilled
      // .filter((p) => p.status === 'fulfilled')
      .map((p: any) => p.value as MUsersRaw)
    // .filter((u) => u.userid !== userDetails?.userID)

    mentionableU.forEach((u) =>
      addMentionable(u.alias ?? getEmailStart(u.email), u.email, u.userid, u.name, u.nodeid, u.access)
    )

    // mog('SharedNode', { sharedNodes, usersWithAccess, mentionableU, UserAccessDetails })
    */
  }

  return { fetchShareData, fetchSharedNodeUsers }
}
