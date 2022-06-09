import React from 'react'
import Check from '@iconify/icons-bi/check'
import { MexIcon } from '../../../style/Layouts'
import { camelCase } from '../../../utils/lib/strings'
import { ActionGroupType } from '../../../components/spotlight/Actions/useActionStore'
import { ActionGroup } from '@workduck-io/action-request-helper'
import { ActiveStatus, CenteredFlex, RightCut, ServiceCard, ServiceName } from '../../../style/Integration'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import { DEFAULT_LIST_ITEM_ICON } from '@components/spotlight/ActionStage/ActionMenu/ListSelector'
import { mog } from '@utils/lib/helper'

type ActionGroupProps = {
  group: Partial<ActionGroupType>
  onClick: () => void
}

const ActionGroup: React.FC<ActionGroupProps> = ({ group, onClick }) => {
  const { mexIcon } = getIconType(group.icon || DEFAULT_LIST_ITEM_ICON)

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
        <ProjectIconMex isMex={mexIcon} icon={group.icon} size={56} />
      </CenteredFlex>
      <ServiceName>{camelCase(group.actionGroupId)}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup
