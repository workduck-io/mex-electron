import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect, useMemo } from 'react'
import useActions from '../../../components/spotlight/Actions/useActions'
import { Flex, FullHeight, IntegrationContainer, Services, Title } from '../../../style/Integration'
import { mog } from '../../../utils/lib/helper'
import ActionGroup from './ActionGroup'

export const botMap = {
  TELEGRAM: {
    actionGroupId: 'TELEGRAM',
    name: 'Telegram',
    authConfig: {
      authURL: 'https://t.me/Mex_Offical_Bot'
    },
    connected: false,
    icon: 'logos:telegram'
  },
  SLACK: {
    actionGroupId: 'SLACK',
    name: 'Slack',
    connected: false,
    icon: 'logos:slack-icon'
  }
}

const ActionGroupsPage = () => {
  const { goTo } = useRouting()
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const connectedGroups = useActionsCache((store) => store.connectedGroups)

  const { getAuthorizedGroups, sortActionGroups } = useActions()

  useEffect(() => {
    getAuthorizedGroups(true).then(() => mog('Authorized groups loaded'))
  }, [])

  const onClick = (route: string, actionGroupId: string) => {
    goTo(route, NavigationType.push, actionGroupId)
  }

  const groups = useMemo(() => sortActionGroups(actionGroups, connectedGroups), [actionGroups, connectedGroups])

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Title>Integrations</Title>
          <Services>
            {groups.map((group) => (
              <ActionGroup
                key={group.actionGroupId}
                group={group}
                onClick={() => onClick(ROUTE_PATHS.integrations, group.actionGroupId)}
              />
            ))}
          </Services>
          <Title>Bots</Title>
          <Services>
            {Object.values(botMap).map((group) => (
              <ActionGroup
                key={group.actionGroupId}
                group={group}
                onClick={() => onClick(`${ROUTE_PATHS.integrations}/bots`, group.actionGroupId)}
              />
            ))}
          </Services>
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default ActionGroupsPage
