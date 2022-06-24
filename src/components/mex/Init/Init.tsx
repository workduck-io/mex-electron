import { IpcAction } from '@data/IpcAction'
import { useCalendar } from '@hooks/useCalendar'
import { useFetchShareData } from '@hooks/useFetchShareData'
import { useImportExport } from '@hooks/useImportExport'
import { useInitialize } from '@hooks/useInitialize'
import { useInternetListener } from '@hooks/useInternetListener'
import { getNodeidFromPathAndLinks } from '@hooks/useLinks'
import useLoad from '@hooks/useLoad'
import { useLocalData, useMentionData, useTokenData } from '@hooks/useLocalData'
import { useSaveAndExit } from '@hooks/useSaveAndExit'
import { useRecieveMentions, useRecieveTokens, useSyncData } from '@hooks/useSyncData'
import { useAuthStore } from '@services/auth/useAuth'
import { useAnalysis, useAnalysisIPC } from '@store/useAnalysis'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useBrowserNavigation, useRouting } from '@views/routes/urls'
import { useAuth } from '@workduck-io/dwindle'
import { ipcRenderer } from 'electron'
import { useEffect } from 'react'
import config from '../../../config.json'
import { useActionsPerfomerClient } from '../../spotlight/Actions/useActionPerformer'
import { useRedirectAuth } from '../Auth/useRedirectAuth'
import { useInitLoader } from './useInitLoader'
import { useIpcListenerOnInit } from './useIpcListenerOnInit'
import { useNavigator } from './useNavigator'

const Init = () => {
  const { goTo } = useRouting()
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)

  const { init } = useInitialize()
  const { loadNode } = useLoad()
  const { initCognito } = useAuth()

  const { getLocalData } = useLocalData()
  const { getUpcomingEvents, getUserEvents } = useCalendar()

  const { setReceiveToken } = useRecieveTokens()
  const { setReceiveMention } = useRecieveMentions()

  const { getTokenData } = useTokenData()
  const { getMentionData } = useMentionData()
  const { initActionPerfomerClient } = useActionsPerfomerClient()

  /**
   * Initialization of the app data, search index and auth,
   * also sends the auth details to the other processess
   * */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      getLocalData()
        .then((d) => {
          mog('Initializaing', { d })
          return d
        })
        .then(({ fileData }) => {
          init(fileData)
          getTokenData()
          getMentionData()
          return fileData
        })
        .then((d) => {
          const userAuthenticatedEmail = initCognito({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
          })
          if (userAuthenticatedEmail) {
            ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: true })
            initActionPerfomerClient(useAuthStore.getState().userDetails?.userID)
            return { d, auth: true }
          }
          setUnAuthenticated()
          ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
          return { d, auth: false }
        })
        .then(({ d, auth }) => {
          if (auth) {
            // TODO: Fix loading of the __null__ node on first start of a fresh install
            const baseNodeId = getNodeidFromPathAndLinks(d.ilinks, d.baseNodeId)
            loadNode(baseNodeId, {
              fetch: false,
              savePrev: false,
              withLoading: false
            })
            return { nodeid: baseNodeId }
          }
        })
        .then(({ nodeid }) => {
          goTo(ROUTE_PATHS.node, NavigationType.replace, nodeid)
        })
        .catch((e) => console.error(e)) // eslint-disable-line no-console
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { setIpc } = useSyncData()
  const setAnalysisIpc = useAnalysisIPC()

  const { redirectAuthHandler } = useRedirectAuth()

  useEffect(() => {
    const e1 = getUserEvents()
    const e2 = getUpcomingEvents()
    redirectAuthHandler()

    setIpc()
    setReceiveToken()
    setReceiveMention()

    // Setup recieving the analysis call
    setAnalysisIpc()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useAnalysis()
  useNavigator()
  useInitLoader()
  useSaveAndExit()
  useImportExport()
  useInternetListener()
  useIpcListenerOnInit()
  useBrowserNavigation()

  return null
}

export default Init
