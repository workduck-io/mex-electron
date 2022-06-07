import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { shell } from 'electron'
import React from 'react'
import { useParams } from 'react-router-dom'
import Detail from './Detail'
import GlobalSectionProvider from './GlobalSection/GlobalSectionProvider'
import ServiceHeader from './ServiceHeader'
import ServiceInfo from './ServiceInfo'

const Actions = () => {
  const params = useParams()
  const actionGroupId = params?.actionGroupId

  const groupedActions = useActionsCache((store) => store.groupedActions)
  const actionGroups = useActionsCache((store) => store.actionGroups)

  const actionGroup = actionGroups[actionGroupId]
  const connectedGroups = useActionsCache((store) => store.connectedGroups)

  const isConnected = connectedGroups[actionGroupId]

  const onConnectClick = () => {
    const url = actionGroup?.authConfig?.authURL
    if (url) shell.openExternal(url)
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={actionGroup.description}
        icon={actionGroup.icon}
        isConnected={isConnected}
        title={actionGroup.name}
        onClick={onConnectClick}
      />
      <GlobalSectionProvider
        actionGroupId={actionGroupId}
        isConnected={isConnected}
        globalActionId={actionGroup?.globalActionId}
      />
      <Detail actions={Object.values(groupedActions?.[actionGroupId] ?? {})} icon={actionGroup.icon} />
    </ServiceInfo>
  )
}

export default Actions
