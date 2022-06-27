import { useBookmarks } from '@hooks/useBookmarks'
import { useFetchShareData } from '@hooks/useFetchShareData'
import { useIntervalWithTimeout } from '@hooks/useRelativeTime'
import { useAuthStore } from '@services/auth/useAuth'
import { PollActions, useApiStore } from '@store/useApiStore'
import { mog } from '@utils/lib/helper'
import { useApi } from './useSaveApi'

export const PollingInterval = {
  [PollActions.shared]: 5 * 60 * 1000, // 5 minutes
  [PollActions.hierarchy]: 5 * 60 * 1000, // 5 minutes
  [PollActions.bookmarks]: 30 * 60 * 1000 // 30 minutes
}

export const usePolling = () => {
  const polling = useApiStore((store) => store.polling)
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  const { getNodesByWorkspace } = useApi()
  const { getAllBookmarks } = useBookmarks()
  const { fetchShareData } = useFetchShareData()

  useIntervalWithTimeout(
    () => {
      fetchShareData().then(() => mog('Successfully fetched shared nodes'))
    },
    isAuthenticated && polling.has(PollActions.shared) ? PollingInterval[PollActions.shared] : null
  )

  useIntervalWithTimeout(
    () => {
      getAllBookmarks().then(() => mog('Successfully fetched bookmarks'))
    },
    isAuthenticated && polling.has(PollActions.bookmarks) ? PollingInterval[PollActions.bookmarks] : null
  )

  useIntervalWithTimeout(
    () => {
      getNodesByWorkspace().then(() => mog('Successfully fetched hierarchy'))
    },
    isAuthenticated && polling.has(PollActions.hierarchy) ? PollingInterval[PollActions.hierarchy] : null
  )
}
