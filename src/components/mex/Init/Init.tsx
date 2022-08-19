import { IpcAction } from '@data/IpcAction'
import { useAutoSyncUserPreference } from '@hooks/useSyncUserPreferences'
import { useImportExport } from '@hooks/useImportExport'
import { useInitialize } from '@hooks/useInitialize'
import { useInternetListener } from '@hooks/useInternetListener'
import useLoad from '@hooks/useLoad'
import { useLocalData, useMentionData, useTokenData } from '@hooks/useLocalData'
import { useNodes } from '@hooks/useNodes'
import { useSaveAndExit } from '@hooks/useSaveAndExit'
import { useAuthStore } from '@services/auth/useAuth'
import { useAnalysis } from '@store/useAnalysis'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useBrowserNavigation, useRouting } from '@views/routes/urls'
import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import config from '../../../config.json'
import { useActionsPerfomerClient } from '../../spotlight/Actions/useActionPerformer'
import { useInitLoader } from './useInitLoader'
import { useIpcListenerOnInit } from './useIpcListenerOnInit'
import { useNavigator } from './useNavigator'

const Init = () => {
  const { goTo } = useRouting()
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)

  const { init } = useInitialize()
  const { loadNode } = useLoad()
  const { updateBaseNode } = useNodes()
  const { initCognito } = useAuth()

  const { getLocalData } = useLocalData()
  const { getTokenData } = useTokenData()
  const { getMentionData } = useMentionData()
  const { initActionPerfomerClient } = useActionsPerfomerClient()

  /**
   * Check auth first, hydrate all stores with local data
   * */
  useEffect(() => {
    const initUserAndApp = () => {
      const authenticatedUserEmail = initCognito({
        UserPoolId: config.cognito.USER_POOL_ID,
        ClientId: config.cognito.APP_CLIENT_ID
      })

      if (authenticatedUserEmail) {
        initActionPerfomerClient(useAuthStore.getState().userDetails?.userID)

        getLocalData()
          .then(({ fileData }) => {
            init(fileData)
            getTokenData()
            getMentionData()
          })
          .then(() => {
            const baseNode = updateBaseNode()

            loadNode(baseNode?.nodeid, {
              fetch: false,
              savePrev: false,
              withLoading: false
            })

            return { nodeid: baseNode?.nodeid }
          })
          .then(({ nodeid }) => {
            goTo(ROUTE_PATHS.node, NavigationType.replace, nodeid)
          })
          .catch((e) => {
            mog('Unable to Initialize App', { msg: e })
          })
      } else {
        setUnAuthenticated()
      }
    }

    initUserAndApp()
  }, [])

  useAnalysis()
  useNavigator()
  useInitLoader()
  useSaveAndExit()
  useImportExport()
  useInternetListener()
  useIpcListenerOnInit()
  useBrowserNavigation()
  useAutoSyncUserPreference()

  return null
}

export default Init
