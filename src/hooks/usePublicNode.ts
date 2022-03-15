import { client } from '@workduck-io/dwindle'

import { apiURLs } from '../apis/routes'
import { useAuthStore } from '../services/auth/useAuth'
import { mog } from '../utils/lib/helper'
import { useRecentsStore } from '../store/useRecentsStore'

const usePublicNode = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { setNodePublic, setNodePrivate } = useRecentsStore(({ setNodePublic, setNodePrivate }) => ({
    setNodePublic,
    setNodePrivate
  }))

  const makeNodePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNodePublic(nodeId)

    return await client
      .patch(
        URL,
        {},
        {
          headers: {
            'workspace-id': getWorkspaceId()
          }
        }
      )
      .then((resp) => resp.data)
      .then((data) => {
        if (data.nodeUID === nodeId) {
          const publicURL = apiURLs.getNodePublicURL(data.nodeUID)
          setNodePublic(data.nodeUID, publicURL)
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
      .patch(
        URL,
        {},
        {
          headers: {
            'workspace-id': getWorkspaceId()
          }
        }
      )
      .then((resp) => resp.data)
      .then((data) => {
        if (data.nodeUID === nodeId) {
          setNodePrivate(data.nodeUID)
          return data.nodeUID
        } else throw new Error('Error making node private')
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
      })
  }

  return { makeNodePublic, makeNodePrivate }
}

export default usePublicNode
