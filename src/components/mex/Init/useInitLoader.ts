import { useApi } from '@apis/useSaveApi'
import { hierarchyParser } from '@hooks/useHierarchy'
import { useAuthStore } from '@services/auth/useAuth'
import useDataStore from '@store/useDataStore'
import { useEffect } from 'react'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const setILinks = useDataStore((store) => store.setIlinks)

  const { getNodesByWorkspace } = useApi()

  useEffect(() => {
    if (isAuthenticated) {
      getNodesByWorkspace().then((data) => {
        const nodes = hierarchyParser(data)
        if (nodes && nodes.length > 0) {
          setILinks(nodes)
        }
      })
    }
  }, [isAuthenticated])
}
