import React from 'react'
import Check from '@iconify/icons-bi/check'
import { MexIcon } from '../../../style/Layouts'
import { camelCase } from '../../../utils/lib/strings'
import { ActionGroupType } from '../../../components/spotlight/Actions/useActionStore'
import { ActionGroup } from '@workduck-io/action-request-helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../routes/urls'
import { ActiveStatus, CenteredFlex, RightCut, ServiceCard, ServiceName } from '../../../style/Integration'
import { ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'

type ActionGroupProps = {
  group: ActionGroupType
}

const ActionGroup: React.FC<ActionGroupProps> = ({ group }) => {
  const { goTo } = useRouting()

  const onClick = () => {
    goTo(ROUTE_PATHS.integrations, NavigationType.push, group.actionGroupId)
  }

  return (
    <ServiceCard data-tour="service-connect" onClick={onClick} hover={!group?.connected}>
      {group?.connected && (
        <>
          <RightCut />
          <ActiveStatus>
            <MexIcon noHover height={24} icon={Check} />
          </ActiveStatus>
        </>
      )}
      <CenteredFlex>
        <ProjectIconMex icon={group.icon} size={56} />
      </CenteredFlex>
      <ServiceName>{camelCase(group.actionGroupId)}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup
