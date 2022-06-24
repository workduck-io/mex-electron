import { useInterval } from '@hooks/useRelativeTime'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { PollActions, useApiStore } from '@store/useApiStore'
import { mog } from '@utils/lib/helper'
import { useApi } from './useSaveApi'

export const PollingInterval = {
  [PollActions.shared]: 5 * 60 * 1000, // 5 minutes
  [PollActions.hierarchy]: 3 * 60 * 1000, // 3 minutes
  [PollActions.bookmarks]: 30 * 60 * 1000 // 30 minutes
}

export const usePolling = () => {
  const { getNodesByWorkspace } = useApi()
  const polling = useApiStore((store) => store.polling)
  const { getAllSharedNodes } = usePermission()
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  useInterval(
    () => {
      getAllSharedNodes().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated && polling.has(PollActions.shared) ? PollingInterval[PollActions.shared] : null
  )

  useInterval(
    () => {
      getNodesByWorkspace().then(() => mog('Successfully fetched hierarchy'))
    },
    isAuthenticated && polling.has(PollActions.hierarchy) ? PollingInterval[PollActions.hierarchy] : null
  )
}
