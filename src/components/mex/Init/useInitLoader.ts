import { useApi } from '@apis/useSaveApi'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import useActions from '@components/spotlight/Actions/useActions'
import { useFetchShareData } from '@hooks/useFetchShareData'
import { usePortals } from '@hooks/usePortals'
import { useAuthentication, useAuthStore } from '@services/auth/useAuth'
import { useLayoutStore } from '@store/useLayoutStore'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { initActionPerfomerClient } = useActionsPerfomerClient()

  const { getNodesByWorkspace } = useApi()
  const { getGroupsToView } = useActions()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

  const fetchAll = async () => {
    initActionPerfomerClient(useAuthStore.getState().userDetails?.userID)
    setShowLoader(true)
    try {
      await Promise.allSettled([getNodesByWorkspace(), getGroupsToView(), fetchShareData(), initPortals()])
      setShowLoader(false)
    } catch (err) {
      setShowLoader(false)
      logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll()
    }
  }, [isAuthenticated])
}
