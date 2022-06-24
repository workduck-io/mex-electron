import { useApi } from '@apis/useSaveApi'
import useActions from '@components/spotlight/Actions/useActions'
import { useFetchShareData } from '@hooks/useFetchShareData'
import { hierarchyParser } from '@hooks/useHierarchy'
import { useAuthStore } from '@services/auth/useAuth'
import useDataStore from '@store/useDataStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { mog } from '@utils/lib/helper'
import { useEffect } from 'react'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const setILinks = useDataStore((store) => store.setIlinks)

  const setShowLoader = useLayoutStore((store) => store.setShowLoader)

  const { getNodesByWorkspace } = useApi()
  const { getGroupsToView } = useActions()
  const { fetchShareData } = useFetchShareData()

  const fetchAll = async () => {
    setShowLoader(true)
    try {
      await Promise.allSettled([
        getNodesByWorkspace().then((data) => {
          const nodes = hierarchyParser(data)
          if (nodes && nodes.length > 0) {
            setILinks(nodes)
          }
        }),
        getGroupsToView(),
        fetchShareData()
      ])
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
