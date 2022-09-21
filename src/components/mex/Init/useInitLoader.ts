import { useEffect } from 'react'

import { useApi } from '@apis/useSaveApi'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import useActions from '@components/spotlight/Actions/useActions'
import useArchive from '@hooks/useArchive'
import { useFetchShareData } from '@hooks/useFetchShareData'
import useLoad from '@hooks/useLoad'
import { useNodes } from '@hooks/useNodes'
import { usePortals } from '@hooks/usePortals'
import { useAuthentication, useAuthStore } from '@services/auth/useAuth'
import { useLayoutStore } from '@store/useLayoutStore'
import { runBatch } from '@utils/lib/batchPromise'
import { mog } from '@utils/lib/helper'
import { useRouting, ROUTE_PATHS, NavigationType } from '@views/routes/urls'
import toast from 'react-hot-toast'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const { loadNode } = useLoad()
  const { updateBaseNode } = useNodes()

  const { goTo } = useRouting()

  const { initActionPerfomerClient } = useActionsPerfomerClient()

  const { getNodesByWorkspace, getAllSnippetsByWorkspace, getAllNamespaces } = useApi()
  const { getArchiveNotesHierarchy } = useArchive()
  const { getGroupsToView } = useActions()
  const { logout } = useAuthentication()
  const { fetchShareData } = useFetchShareData()
  const { initPortals } = usePortals()

  const backgroundFetch = async () => {
    try {
      runBatch<any>([fetchShareData(), getArchiveNotesHierarchy()])
    } catch (err) {
      mog('Background fetch failed')
    }
  }

  const fetchAll = async () => {
    initActionPerfomerClient(useAuthStore.getState().userDetails?.userID)
    setShowLoader(true)
    try {
      const res = await runBatch<any>([
        getNodesByWorkspace(),
        getAllSnippetsByWorkspace(),
        getAllNamespaces(),
        getGroupsToView(),
        initPortals()
      ])

      const baseNode = updateBaseNode()
      loadNode(baseNode?.nodeid, { savePrev: false, fetch: false })
      goTo(ROUTE_PATHS.node, NavigationType.push, baseNode?.nodeid)

      setShowLoader(false)
    } catch (err) {
      setShowLoader(false)
      logout()
      toast('Something went wrong while initializing')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      backgroundFetch()
      fetchAll()
    }
  }, [isAuthenticated])
}
