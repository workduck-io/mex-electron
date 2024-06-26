import useWebSocket from 'react-use-websocket'

import { useAuthStore as useDwindleStore} from '@workduck-io/dwindle'
import { useAuthStore } from '@services/auth/useAuth'
import { mog } from '@workduck-io/mex-utils'

import config from "../config.json"
import useRouteStore, { BannerType } from '@store/useRouteStore'
import { SocketActionType } from '../types/socket'

const useSocket = () => {
  const userId = useAuthStore((s) => s.userDetails?.userID)
  const idToken = useDwindleStore((s) => s.userCred?.token)

  const addUser = useRouteStore((s) => s.addUserInRoute)
  const removeUser = useRouteStore((s) => s.removeUserFromRoute)
  const setActiveUsers = useRouteStore((s) => s.addRouteInfo)

  const handleAction = (action: SocketActionType, data: any) => {
    switch (action) {
      case SocketActionType.ROUTE_CHANGE:
        break
      case SocketActionType.CONTENT_UPDATE:
        break
      case SocketActionType.USER_LIST_UPDATE:
        if (data.joined) {
          addUser(data.route, data.joined)
        }

        if (data.left) {
          removeUser(data.route, data.left)
        }

        if (data.users) {
          setActiveUsers(data.route, { users: data.users, banners: data.users.length > 0 ? [BannerType.editor] : [] })
        }
        break
      default:
        mog('No Handler for this action', { action, data })
    }
  }

  const handleSocketMessage = (event) => {
    if (event.data) {
      const message = JSON.parse(event.data)
      handleAction(message.action, message.data)
    }
  }

  const utilFunctions = useWebSocket(
    config.websocket.URL,
    {
      onOpen: () => mog('CONNECTION OPENED'),
      retryOnError: true,
      onError: (event) => {
        mog('Socket Error Occured', { event })
      },
      onMessage: handleSocketMessage,
      queryParams: { userId, Authorizer: idToken },
      share: true
    },
    !!idToken
  )

  return utilFunctions
}

export default useSocket