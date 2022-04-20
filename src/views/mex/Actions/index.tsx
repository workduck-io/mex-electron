import React, { useEffect } from 'react'
import useActions from '../../../components/spotlight/Actions/useActions'
import { useActionStore } from '../../../components/spotlight/Actions/useActionStore'
import { Flex, FullHeight, IntegrationContainer, Services, Title } from '../../../style/Integration'
import { mog } from '../../../utils/lib/helper'
import ActionGroup from './ActionGroup'

const ActionGroupsPage = () => {
  const actionGroups = useActionStore((store) => store.actionGroups)
  const { getAuthorizedGroups } = useActions()

  useEffect(() => {
    getAuthorizedGroups().then(() => mog('Authorized groups loaded'))
  }, [])

  return (
    <Flex>
      <FullHeight>
        <IntegrationContainer>
          <Title>Integrations</Title>
          <Services>
            {Object.values(actionGroups).map((group) => (
              <ActionGroup key={group.actionGroupId} group={group} />
            ))}
          </Services>
        </IntegrationContainer>
      </FullHeight>
    </Flex>
  )
}

export default ActionGroupsPage
