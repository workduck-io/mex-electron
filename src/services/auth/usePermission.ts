import { useApi } from '@apis/useSaveApi'
import { useAuthStore } from '@services/auth/useAuth'
import useDataStore from '@store/useDataStore'
import { iLinksToUpdate } from '@utils/hierarchy'
import { batchArray, runBatch } from '@utils/lib/batchPromise'
import { mog } from '@utils/lib/mog'
import { SHARED_NAMESPACE } from '@utils/lib/paths'


import { API } from '../../../src/API'
import { SharedNode } from '../../types/Types'
import { AccessLevel } from '../../types/mentions'

interface SharedNodesPreset {
  status: 'success'
  data: SharedNode[]
}

interface SharedNodesErrorPreset {
  status: 'error'
  data: SharedNode[]
}

export const usePermission = () => {
  // const authDetails = useAuthStore()
  const { bulkGetNodes } = useApi()

  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    // mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await API.share.grantNodePermission(payload).then((resp) => {
      mog('grantPermission resp', { resp })
      return resp
    })
  }

  const changeUserPermission = async (nodeid: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    const payload = {
      type: 'UpdateAccessTypesRequest',
      nodeID: nodeid,
      userIDToAccessTypeMap
    }
    // mog('changeThat permission', { payload })
    // return 'escaped'
    return await API.share.updateNodePermission(payload).then((resp) => {
      mog('changeUsers resp', { resp })
      return resp
    })
  }

  const revokeUserAccess = async (nodeid: string, userids: string[]) => {
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    // mog('revokeThat permission', { payload })
    // return 'escaped'
    return await API.share.revokeNodeAccess(payload).then((resp) => {
      mog('revoke That permission resp', { resp })
      return resp
    })
  }

  const getAllSharedNodes = async (): Promise<SharedNodesPreset | SharedNodesErrorPreset> => {
    try {
      return await API.share.getSharedNodes().then(async (sharedNodesRaw: any) => {
        const sharedNodes = sharedNodesRaw.map((n): SharedNode => {
          let metadata = undefined
          try {
            const basemetadata = n?.nodeMetadata
            metadata = JSON.parse(basemetadata ?? '{}')
            if (metadata?.createdAt && metadata.updatedAt) {
              return {
                path: n.nodeTitle,
                nodeid: n.nodeID,
                currentUserAccess: n.accessType,
                owner: n.ownerID,
                sharedBy: n.granterID,
                createdAt: metadata.createdAt,
                updatedAt: metadata.updatedAt,
                namespace: SHARED_NAMESPACE.id
              }
            }
          } catch (e) {
            mog('Error parsing metadata', { e })
          }
          return {
            path: n.nodeTitle,
            nodeid: n.nodeID,
            currentUserAccess: n.accessType,
            owner: n.ownerID,
            sharedBy: n.grantedID,
            namespace: SHARED_NAMESPACE.id
          }
        })
        const localSharedNodes = useDataStore.getState().sharedNodes
        const { toUpdateLocal } = iLinksToUpdate(localSharedNodes, sharedNodes)
          const batches = batchArray(
          toUpdateLocal.map((val) => val.nodeid),
          10
        )
        const promises = batches.map((ids) => bulkGetNodes(ids, undefined, true))
        await runBatch(promises)
        mog('SharedNodes', { sharedNodes })
        return { status: 'success', data: sharedNodes }
      })
    } catch (e) {
      mog('Error Fetching Shared Nodes', { e })
      return { data: [], status: 'error' }
    }
  }

  const getUsersOfSharedNode = async (nodeid: string): Promise<{ nodeid: string; users: Record<string, string> }> => {
    try {
      const users = await API.share.getNodePermissions(nodeid)
      return { nodeid, users }
    } catch (e) {
      mog('Failed to get SharedUsers', { e })
      return { nodeid, users: {} }
    }
  }

  return { grantUsersPermission, getUsersOfSharedNode, changeUserPermission, revokeUserAccess, getAllSharedNodes }
}
