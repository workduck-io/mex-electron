import React, { useEffect } from 'react'
import { shell } from 'electron'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import styled, { css, useTheme } from 'styled-components'
import { CardStyles } from '../Settings/Importers'
import IconButton, { Button } from '../../../style/Buttons'
import { StyledEditor } from '../../../style/Editor'
import { CardShadow } from '../../../style/helpers'
import { CenteredFlex, Title } from '../../../style/Integration'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { FlexBetween } from '../../spotlight/Actions/styled'
import { useActionStore } from '../../spotlight/Actions/useActionStore'
import { Description } from '../../spotlight/SearchResults/styled'
import { ActionHelperConfig } from '@workduck-io/action-request-helper'
import { mog } from '../../../utils/lib/helper'
import { ErrorBoundary } from 'react-error-boundary'
import { MexIcon } from '../../../style/Layouts'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../../../hooks/useShortcutListener'

const ServiceContainer = styled(StyledEditor)``

const GroupHeaderContainer = styled.section`
  ${CardStyles}
  ${CardShadow}
  position: relative;

  margin-top: 1rem;
  user-select: none;

  & > div {
    display: flex;
    padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.medium};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    justify-content: space-evenly;
  }

  height: fit-content;
`

const ServiceDescription = styled.p`
  margin: 0 1rem 0 0;
  font-size: 1rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.default};
`

const ActionGroupIcon = styled(CenteredFlex)`
  margin: 0 1rem;

  & > span {
    /* background: ${({ theme }) => theme.colors.background.card}; */
    padding: 1rem;
    margin: 1rem 0;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const GroupHeader = styled.div<{ connected?: boolean }>`
  ${Title} {
    padding: 0;
    font-size: 2.5rem;
  }

  ${FlexBetween} {
    padding-right: 1rem;
  }

  ${Button} {
    padding: 0.5rem 0.75rem;
    ${({ connected, theme }) =>
      connected &&
      css`
        background: transparentize(0.6, theme.colors.background.app);
        color: theme.colors.text.heading;
        cursor: default;
        :hover {
          box-shadow: none;
        }
      `}
  }
`

const FloatingIcon = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

const ActionsContainer = styled.section`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  width: 100%;
  overflow: hidden auto;
  max-height: 60vh;

  & > header {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.fade};
    font-weight: 700;
    padding: 1rem 0.5rem 1.5rem;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding: 0.75rem ${({ theme }) => theme.spacing.small};

  /* border-radius: ${({ theme }) => theme.borderRadius.small}; */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[7]};

  ${ActionGroupIcon} {
    flex: none;
    width: auto;
  }

  section {
    padding: 0 ${({ theme }) => theme.spacing.small};
  }

  h4 {
    margin: 0;
    font-size: medium;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.default};
  }

  ${Description} {
    font-size: 0.8rem;
  }
`

const Action: React.FC<{ action: ActionHelperConfig; icon?: string }> = ({ action, icon }) => {
  const theme = useTheme()

  return (
    <ActionContainer>
      <ActionGroupIcon>
        <MexIcon color={theme.colors.primary} icon={icon} height="1.25rem" width="1.25rem" />
      </ActionGroupIcon>
      <section>
        <h4>{action.name}</h4>
        <Description>{action.description ?? 'No description'}</Description>
      </section>
    </ActionContainer>
  )
}

const ServiceInfo = () => {
  const { params } = useRouting()
  const groupedActions = useActionStore((store) => store.groupedActions)
  const actionGroups = useActionStore((store) => store.actionGroups)
  const { shortcutDisabled } = useKeyListener()

  const actionGroup = actionGroups[params?.actionGroupId]
  const { goTo } = useRouting()
  const theme = useTheme()

  const onConnectClick = () => {
    const url = actionGroup.authConfig.authURL
    if (url) shell.openExternal(url)
  }

  const goBackToIntegrations = () => goTo(ROUTE_PATHS.integrations, NavigationType.replace)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) goBackToIntegrations()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={() => <Button onClick={() => goTo(ROUTE_PATHS.home, NavigationType.replace)}>Back</Button>}
    >
      <ServiceContainer>
        <GroupHeaderContainer>
          <FloatingIcon>
            <IconButton
              size={24}
              shortcut={`Esc`}
              icon={arrowLeftLine}
              onClick={goBackToIntegrations}
              title={'Return to Integrations'}
            />
          </FloatingIcon>
          <div>
            <ActionGroupIcon>
              <span>
                <MexIcon color={theme.colors.primary} icon={actionGroup?.icon} height="10rem" width="10rem" />
              </span>
            </ActionGroupIcon>
            <GroupHeader connected={actionGroup?.connected}>
              <FlexBetween>
                <Title>{actionGroup?.name}</Title>
                <Button onClick={onConnectClick} disabled={actionGroup?.connected}>
                  {actionGroup?.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </FlexBetween>
              <ServiceDescription>
                {actionGroup?.description ??
                  `Magna quis cupidatat laboris aliquip esse. Ut Despacito eu voluptate qui incididunt ipsum. Officia et esse
              enim laborum ullamco magna labore quis sit mollit. Esse amet nostrud pariatur esse. Commodo consequat
              ipsum tempor ad cillum ad et esse nostrud veniam pariatur excepteur laboris. Adipisicing aliqua do
              proident aliquip ad et voluptate et ut excepteur mollit do tempor. Magna nostrud esse sunt anim quis in.
              Amet ut fugiat adipisicing officia aliquip quis non. Veniam magna dolor consequat quis aliqua ea ipsum
              reprehenderit commodo commodo. Minim minim sit sit magna labore sint esse ipsum.`}
              </ServiceDescription>
            </GroupHeader>
          </div>
          <ActionsContainer>
            <header>What you can do? </header>
            {Object.values(groupedActions?.[params?.actionGroupId] ?? {}).map((action) => (
              <Action key={action?.actionId} action={action} icon={actionGroup.icon} />
            ))}
          </ActionsContainer>
        </GroupHeaderContainer>
      </ServiceContainer>
    </ErrorBoundary>
  )
}

export default ServiceInfo
