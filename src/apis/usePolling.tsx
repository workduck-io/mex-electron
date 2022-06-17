import { useInterval } from '@hooks/useRelativeTime'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { mog } from '@utils/lib/helper'

const SHARED_NODES_POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes

export const usePolling = () => {
  const { getAllSharedNodes } = usePermission()
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  useInterval(
    () => {
      getAllSharedNodes().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated ? SHARED_NODES_POLLING_INTERVAL : null
  )
}
