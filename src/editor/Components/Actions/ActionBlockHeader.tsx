import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import React from 'react'
import { useTheme } from 'styled-components'
import { ActionBlockContainer } from './styled'
import { MexIcon } from '@style/Layouts'
import BackIcon from '@iconify/icons-ph/caret-circle-left-light'

import { useSpotlightAppStore } from '@store/app.spotlight'

const ActionBlockHeader = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const isView = useSpotlightAppStore((store) => store.view) === 'item'
  const setView = useSpotlightAppStore((store) => store.setView)

  const theme = useTheme()

  const onBackClick = () => {
    setView(undefined)
  }

  return (
    <ActionBlockContainer>
      {isView && (
        <MexIcon
          icon={BackIcon}
          onClick={onBackClick}
          height="2rem"
          width="2rem"
          color={theme.colors.primary}
          margin="0 0.5rem 0 0"
        />
      )}
      <MexIcon
        icon={activeAction?.icon}
        height="1.25em"
        noHover
        width="1.25rem"
        color={theme.colors.primary}
        margin="0 0.5rem 0 0"
      />
      <div>{activeAction?.name}</div>
    </ActionBlockContainer>
  )
}

export default ActionBlockHeader
