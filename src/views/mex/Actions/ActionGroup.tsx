import React from 'react'

import { DEFAULT_LIST_ITEM_ICON } from '@components/spotlight/ActionStage/ActionMenu/ListSelector'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import Check from '@iconify/icons-bi/check'
import { mog } from '@utils/lib/helper'

import { ActionGroupType } from '../../../components/spotlight/Actions/useActionStore'
import { ActiveStatus, CenteredFlex, RightCut, ServiceCard, ServiceName } from '../../../style/Integration'
import { MexIcon } from '../../../style/Layouts'
import { titleCaseUnderScore } from '../../../utils/lib/strings'

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
      <ServiceName>{titleCaseUnderScore(group.actionGroupId)}</ServiceName>
    </ServiceCard>
  )
}

export default ActionGroup
