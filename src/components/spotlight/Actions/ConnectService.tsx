import { Button } from '@style/Buttons'
import { MexIcon } from '@style/Layouts'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { useActionStore } from './useActionStore'

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
`

const ConnectService = () => {
  const activeAction = useActionStore((store) => store.activeAction)

  const theme = useTheme()
  const { goTo } = useRouting()

  const onLoginClick = () => {
    if (activeAction) {
      goTo(ROUTE_PATHS.integrations, NavigationType.push, activeAction?.actionGroupId)
    }
  }

  return (
    <Container>
      <MexIcon icon={activeAction?.icon} height="3rem" width="3rem" color={theme.colors.primary} />
      <div>{`You're not connected to ${activeAction?.actionGroupId?.toLocaleLowerCase()}`}</div>
      <Button onClick={onLoginClick}>Connect</Button>
    </Container>
  )
}

export default ConnectService
