import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import React, { useEffect, useMemo } from 'react'
import useActions from '../../../components/spotlight/Actions/useActions'
import { Flex, FullHeight, IntegrationContainer, Services, Title } from '../../../style/Integration'
import { mog } from '../../../utils/lib/helper'
import ActionGroup from './ActionGroup'

const ActionGroupsPage = () => {
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const connectedGroups = useActionsCache((store) => store.connectedGroups)

  const { getAuthorizedGroups, sortActionGroups } = useActions()

  useEffect(() => {
    getAuthorizedGroups(true).then(() => mog('Authorized groups loaded'))
  }, [])

  const groups = useMemo(() => sortActionGroups(actionGroups, connectedGroups), [actionGroups, connectedGroups])

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Title>Integrations</Title>
          <Services>
            {groups.map((group) => (
              <ActionGroup key={group.actionGroupId} group={group} />
            ))}
          </Services>
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default ActionGroupsPage
