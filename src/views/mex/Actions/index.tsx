import usePortalStore from '@components/mex/Integrations/Portals/usePortalStore'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { ActionGroupType } from '@components/spotlight/Actions/useActionStore'
import { usePortals } from '@hooks/usePortals'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect, useMemo } from 'react'
import useActions from '../../../components/spotlight/Actions/useActions'
import { Flex, FullHeight, IntegrationContainer } from '../../../style/Integration'
import { mog } from '../../../utils/lib/helper'
import Section from './Section'

const ActionGroupsPage = () => {
  const { goTo } = useRouting()
  const apps = usePortalStore((store) => store.apps)
  const connectedPortals = usePortalStore((store) => store.connectedPortals)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const connectedGroups = useActionsCache((store) => store.connectedGroups)

  const { getConnectedPortals } = usePortals()
  const { getAuthorizedGroups, sortActionGroups } = useActions()

  useEffect(() => {
    getAuthorizedGroups(true).then(() => mog('Authorized groups loaded'))
    getConnectedPortals()
  }, [])

  const onClick = (route: string, actionGroupId: string) => {
    goTo(route, NavigationType.push, actionGroupId)
  }

  const groups = useMemo(
    () => sortActionGroups(actionGroups, (item: any) => connectedGroups[item.actionGroupId]),
    [actionGroups, connectedGroups]
  )

  const portals = useMemo(
    () => sortActionGroups(apps, (item: any) => !!getIsPortalConnected(item.actionGroupId)),
    [apps, connectedPortals]
  )

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Section
            items={groups}
            title="Integrations"
            onClick={(item: ActionGroupType) => onClick(ROUTE_PATHS.integrations, item.actionGroupId)}
          />
          <Section
            items={portals}
            title="Portals"
            onClick={(item: ActionGroupType) => onClick(`${ROUTE_PATHS.integrations}/portal`, item.actionGroupId)}
          />
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default ActionGroupsPage
