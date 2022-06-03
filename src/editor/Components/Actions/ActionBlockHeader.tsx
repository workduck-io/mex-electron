import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import React from 'react'
import { useTheme } from 'styled-components'
import { ActionBlockContainer, LeftHeader } from './styled'
import { MexIcon } from '@style/Layouts'
import BackIcon from '@iconify/icons-ph/caret-circle-left-light'

import { ClickPostActionType } from '@workduck-io/action-request-helper'
import { useMenuPerformer } from '@components/spotlight/ActionStage/ActionMenu/useMenuPerfomer'
import Loading from '@style/Loading'
import useActions from '@components/spotlight/Actions/useActions'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import { DEFAULT_LIST_ITEM_ICON } from '@components/spotlight/ActionStage/ActionMenu/ListSelector'

const ActionBlockHeader = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const isElementView = useActionStore((store) => store.element)?.actionContext?.view
  const isView = useActionStore((store) => store.view) === 'item'
  const setView = useActionStore((store) => store.setView)
  const isLoading = useActionStore((store) => store.isLoading)
  const { getIsServiceConnected } = useActions()

  const { runAction } = useMenuPerformer()
  const theme = useTheme()

  const onBackClick = () => {
    setView(undefined)
  }

  const onRefreshClick = () => {
    runAction({ type: ClickPostActionType.REFRESH_ACTION, shortcut: '$mod+R', icon: 'ic:round-refresh' })
  }

  const isConnected = getIsServiceConnected(activeAction?.actionGroupId)
  const { mexIcon } = getIconType(activeAction?.icon ?? DEFAULT_LIST_ITEM_ICON)

  return (
    <ActionBlockContainer>
      <LeftHeader>
        {isView && !isElementView && (
          <MexIcon
            icon={BackIcon}
            onClick={onBackClick}
            height="1.5rem"
            width="1.5rem"
            color={theme.colors.primary}
            margin="0 0.5rem 0 0"
          />
        )}
        <ProjectIconMex
          isMex={mexIcon}
          icon={activeAction?.icon}
          size={16}
          color={theme.colors.primary}
          margin="0 0.5rem 0 0"
        />
        <div>{activeAction?.name}</div>
      </LeftHeader>
      {isConnected && (
        <>
          {isLoading ? (
            <Loading color={theme.colors.primary} dots={3} transparent />
          ) : (
            <MexIcon
              icon="ic:round-refresh"
              height="1.5em"
              width="1.5rem"
              margin="0 0.5rem 0 0"
              color={theme.colors.primary}
              onClick={onRefreshClick}
            />
          )}
        </>
      )}
    </ActionBlockContainer>
  )
}

export default ActionBlockHeader