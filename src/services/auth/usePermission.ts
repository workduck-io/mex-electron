import { AccessLevel } from '../../types/mentions'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from '@apis/routes'
import { useAuthStore } from '@services/auth/useAuth'

export const usePermission = () => {
  // const authDetails = useAuthStore()
  const workspaceDetails = useAuthStore((s) => s.workspaceDetails)
  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    // mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await client
      .post(apiURLs.sharedNode, payload, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
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
    return await client
      .put(apiURLs.sharedNode, payload, {
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
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
    return await client
      .delete(apiURLs.sharedNode, {
        data: payload,
        headers: {
          'mex-workspace-id': workspaceDetails.id
        }
      })
      .then((resp) => {
        mog('revoke That permission resp', { resp })
        return resp
      })
  }

  const getAllSharedNodes = async () => {
    return await client.get(apiURLs.allSharedNodes).then((resp) => {
      mog('getAllSharedNodes resp', { resp })
      return resp
    })
  }
  return { grantUsersPermission, changeUserPermission, revokeUserAccess, getAllSharedNodes }
}
