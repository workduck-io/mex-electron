import { client } from '@workduck-io/dwindle'

import { apiURLs } from '../apis/routes'
import { useAuthStore } from '../services/auth/useAuth'
import { mog } from '../utils/lib/helper'
import { useRecentsStore } from '../store/useRecentsStore'

const usePublicNode = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setNodePublic, setNodePrivate, checkNodePublic } = useRecentsStore(
    ({ setNodePublic, setNodePrivate, checkNodePublic }) => ({
      setNodePublic,
      setNodePrivate,
      checkNodePublic
    })
  )

  const makeNodePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNodePublic(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'workspace-id': getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((resp) => resp.data)
      .then((nodeUID) => {
        if (nodeUID === nodeId) {
          const publicURL = apiURLs.getNodePublicURL(nodeUID)
          setNodePublic(nodeUID, publicURL)
          return publicURL
        } else throw new Error('Error making node public')
      })
      .catch((error) => {
        mog('MakeNodePublicError', { error })
      })
  }

  const makeNodePrivate = async (nodeId: string) => {
    const URL = apiURLs.makeNodePrivate(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'workspace-id': getWorkspaceId()
        }
      })
      .then((resp) => resp.data)
      .then((nodeUID) => {
        if (nodeUID === nodeId) {
          setNodePrivate(nodeUID)
          return nodeUID
        } else throw new Error('Error making node private')
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
      })
  }

  const isPublic = (nodeid: string) => {
    return checkNodePublic(nodeid)
  }

  return { makeNodePublic, makeNodePrivate, isPublic }
}

export default usePublicNode
