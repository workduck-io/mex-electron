import { IpcAction } from '@data/IpcAction'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { capitalize } from '@utils/lib/strings'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { Button } from '@workduck-io/mex-components'
import { ipcRenderer } from 'electron'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { DEFAULT_LIST_ITEM_ICON } from '../ActionStage/ActionMenu/ListSelector'
import { getIconType, ProjectIconMex } from '../ActionStage/Project/ProjectIcon'
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
  const isSpotlightContext = useSpotlightContext()

  const theme = useTheme()
  const { goTo } = useRouting()

  const onLoginClick = () => {
    if (activeAction) {
      if (!isSpotlightContext) {
        goTo(ROUTE_PATHS.integrations, NavigationType.push, activeAction?.actionGroupId)
      } else {
        ipcRenderer.send(IpcAction.REDIRECT_TO, { page: `${ROUTE_PATHS.integrations}/${activeAction?.actionGroupId}` })
      }
    }
  }

  const { mexIcon } = getIconType(activeAction?.icon || DEFAULT_LIST_ITEM_ICON)

  return (
    <Container>
      <ProjectIconMex isMex={mexIcon} icon={activeAction?.icon} size={32} color={theme.colors.primary} />
      <div>{`You're not connected to ${capitalize(activeAction?.actionGroupId?.toLocaleLowerCase())}`}</div>
      <Button onClick={onLoginClick}>Connect</Button>
    </Container>
  )
}

export default ConnectService
