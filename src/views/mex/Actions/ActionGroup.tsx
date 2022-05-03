import React from 'react'
import Check from '@iconify/icons-bi/check'
import { MexIcon } from '../../../style/Layouts'
import { camelCase } from '../../../utils/lib/strings'
import { ActionGroupType } from '../../../components/spotlight/Actions/useActionStore'
import { ActionGroup } from '@workduck-io/action-request-helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../routes/urls'
import { ActiveStatus, CenteredFlex, RightCut, ServiceCard, ServiceName } from '../../../style/Integration'
import { useTheme } from 'styled-components'

type ActionGroupProps = {
  group: ActionGroupType
}

const ActionGroup: React.FC<ActionGroupProps> = ({ group }) => {
  const { goTo } = useRouting()
  const theme = useTheme()

  const onClick = () => {
    goTo(ROUTE_PATHS.integrations, NavigationType.push, group.actionGroupId)
  }

  return (
    <ServiceCard data-tour="service-connect" onClick={onClick} hover={!group?.connected}>
      {group?.connected && (
        <>
          <RightCut />
          <ActiveStatus>
            <MexIcon height={24} icon={Check} />
          </ActiveStatus>
        </>
      )}
      <CenteredFlex>
        <MexIcon color={theme.colors.primary} icon={group.icon} height="56px" width="56px" />
      </CenteredFlex>
      <ServiceName>{camelCase(group.actionGroupId)}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup