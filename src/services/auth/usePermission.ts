import { AccessLevel } from '../../types/mentions'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'
import { apiURLs } from '@apis/routes'

export const usePermission = () => {
  const grantUsersPermission = async (nodeid: string, userids: string[], access: AccessLevel) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids,
      accessType: access
    }
    return await client.post(apiURLs.sharedNode, payload).then((resp) => {
      mog('grantPermission resp', { resp })
      return resp
    })
  }

  const changeUserPermission = async (nodeid: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    mog('changeThat permission')
    const payload = {
      type: 'UpdateAccessTypesRequest',
      nodeID: nodeid,
      userIDToAccessTypeMap
    }
    return await client.put(apiURLs.sharedNode, payload).then((resp) => {
      mog('changeUsers resp', { resp })
      return resp
    })
  }

  const revokeUserAccess = async (nodeid: string, userids: string[]) => {
    mog('changeThat permission')
    const payload = {
      type: 'SharedNodeRequest',
      nodeID: nodeid,
      userIDs: userids
    }
    return await client
      .delete(apiURLs.sharedNode, {
        data: payload
      })
      .then((resp) => {
        mog('changeUsers resp', { resp })
        return resp
      })
  }
  return { grantUsersPermission, changeUserPermission, revokeUserAccess }
}
