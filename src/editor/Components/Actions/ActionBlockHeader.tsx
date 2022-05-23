import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { useRouting } from '@views/routes/urls'
import React from 'react'
import { useTheme } from 'styled-components'
import { ActionBlockContainer } from './styled'
import BackIcon from '@iconify/icons-ph/caret-circle-left-light'
import { MexIcon } from '@style/Layouts'

const ActionBlockHeader = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const { goBack } = useRouting()
  const theme = useTheme()

  return (
    <ActionBlockContainer>
      <MexIcon
        icon={BackIcon}
        onClick={goBack}
        height="2rem"
        width="2rem"
        color={theme.colors.primary}
        margin="0 0.5rem 0 0"
      />
      <div>{activeAction?.name}</div>
    </ActionBlockContainer>
  )
}

export default ActionBlockHeader
