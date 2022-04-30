import React, { useEffect, useMemo } from 'react'
import useActions from '../../../components/spotlight/Actions/useActions'
import { useActionStore } from '../../../components/spotlight/Actions/useActionStore'
import { Flex, FullHeight, IntegrationContainer, Services, Title } from '../../../style/Integration'
import { mog } from '../../../utils/lib/helper'
import ActionGroup from './ActionGroup'

const ActionGroupsPage = () => {
  const actionGroups = useActionStore((store) => store.actionGroups)
  const connectedGroups = useActionStore((store) => store.connectedGroups)

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
