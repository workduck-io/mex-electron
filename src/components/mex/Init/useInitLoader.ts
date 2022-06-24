import { useApi } from '@apis/useSaveApi'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import useActions from '@components/spotlight/Actions/useActions'
import { useFetchShareData } from '@hooks/useFetchShareData'
import { usePortals } from '@hooks/usePortals'
import { useAuthStore } from '@services/auth/useAuth'
import { useLayoutStore } from '@store/useLayoutStore'
import { mog } from '@utils/lib/helper'
import { useEffect } from 'react'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { initActionPerfomerClient } = useActionsPerfomerClient()

  const { getNodesByWorkspace } = useApi()
  const { getGroupsToView } = useActions()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

  const fetchAll = async () => {
    initActionPerfomerClient(useAuthStore.getState().userDetails?.userID)
    setShowLoader(true)
    try {
      await Promise.allSettled([getNodesByWorkspace(), getGroupsToView(), fetchShareData(), initPortals()])
      setShowLoader(false)
    } catch (err) {
      mog('Error occurred while fetching', { err })
      setShowLoader(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll()
    }
  }, [isAuthenticated])
}
