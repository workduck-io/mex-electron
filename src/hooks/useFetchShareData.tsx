import { usePermission } from '@services/auth/usePermission'
import useDataStore from '@store/useDataStore'
import { mog } from '@utils/lib/helper'

export const useFetchShareData = () => {
  const { getAllSharedNodes, getUsersOfSharedNode } = usePermission()
  const setSharedNodes = useDataStore((s) => s.setSharedNodes)

  const fetchShareData = async () => {
    const sharedNodes = await getAllSharedNodes()
    mog('SharedNode', { sharedNodes })

    const sharedNodeDetails = sharedNodes.map((node) => {
      return getUsersOfSharedNode(node.nodeid)
    })

    const nodeDetails = await Promise.allSettled(sharedNodeDetails)

    mog('SharedNode', { sharedNodes, nodeDetails })
  }

  return { fetchShareData }
}
