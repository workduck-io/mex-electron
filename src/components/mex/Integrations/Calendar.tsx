import { useCalendar } from '@hooks/useCalendar'
import { useTokenStore } from '@services/auth/useTokens'
import { shell } from 'electron'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import GoogleCalendarUser from './GoogleCalendarUser'
import ServiceHeader from './ServiceHeader'
import ServiceInfo from './ServiceInfo'

const CalendarIntegrations = () => {
  const params = useParams()
  const actionGroupId = params?.actionGroupId
  const tokenData = useTokenStore((state) => state.data)

  const { getCalendarActions } = useCalendar()

  const calendarAction = useMemo(() => {
    const cActions = getCalendarActions()
    const action = cActions.find((action) => action.actionGroupId === actionGroupId)
    // mog('CalendarIntegrations', { cActions, action })
    return action
  }, [tokenData])

  const isConnected = calendarAction.connected

  const onConnectClick = () => {
    if (!isConnected) {
      if (calendarAction.authConfig?.onConnectAsync) {
        calendarAction.authConfig.onConnectAsync()
      } else {
        const url = calendarAction.authConfig?.authURL
        if (url) shell.openExternal(url)
      }
    }
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={calendarAction?.description}
        icon={calendarAction?.icon}
        isConnected={isConnected}
        title={calendarAction?.name}
        onClick={onConnectClick}
      />

      {isConnected && calendarAction?.authConfig?.userDetails && (
        <div>
          <GoogleCalendarUser userDetails={calendarAction.authConfig.userDetails} />
        </div>
      )}
    </ServiceInfo>
  )
}

export default CalendarIntegrations
