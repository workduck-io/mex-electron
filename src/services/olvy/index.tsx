import { useEffect } from 'react'
import { useTheme } from 'styled-components'

const useInitOlvy = (showMenu: boolean) => {
  const theme = useTheme()

  useEffect(() => {
    if (showMenu) {
      window.Olvy.init({
        organisation: 'workduck',
        target: '#olvy-target',
        type: 'modal',
        view: {
          showSearch: false,
          compact: false,
          showHeader: true,
          showUnreadIndicator: true,
          unreadIndicatorColor: theme.colors.primary,
          unreadIndicatorPosition: 'top-right'
        }
      })

    return function cleanup() {
      if (showMenu) window.Olvy.teardown()
    }
  }, [showMenu])
}

const identifyOlvyUser = (name: string, email: string, identifier: string, meta: any) => {
  window.Olvy.setUser({ name, email, identifier, meta })
}

export { identifyOlvyUser, useInitOlvy }
