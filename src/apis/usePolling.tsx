import { useInterval } from '@hooks/useRelativeTime'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { mog } from '@utils/lib/helper'
import { useApi } from './useSaveApi'

const SHARED_NODES_POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes
const HIERARCHY_POLLING_INTERVAL = 1 * 60 * 1000 // 3 minutes

export const usePolling = () => {
  const { getNodesByWorkspace } = useApi()
  const { getAllSharedNodes } = usePermission()
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  useInterval(
    () => {
      getAllSharedNodes().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated ? SHARED_NODES_POLLING_INTERVAL : null
  )

  useInterval(
    () => {
      getNodesByWorkspace().then(() => mog('Successfully fetched hierarchy'))
    },
    isAuthenticated ? HIERARCHY_POLLING_INTERVAL : null
  )
}
