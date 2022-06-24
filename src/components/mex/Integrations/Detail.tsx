import { ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import { Description } from '@style/Typography'
import { ActionHelperConfig } from '@workduck-io/action-request-helper'
import React from 'react'
import { useTheme } from 'styled-components'
import { ActionContainer, ActionGroupIcon, ActionsContainer } from './styled'

type DetailProps = {
  actions: Array<ActionHelperConfig>
  icon?: string
  title?: string
}

export const Action: React.FC<{ action: ActionHelperConfig; icon?: string }> = ({ action, icon }) => {
  const theme = useTheme()

  return (
    <ActionContainer>
      <ActionGroupIcon>
        <ProjectIconMex color={theme.colors.primary} icon={icon} size={20} />
      </ActionGroupIcon>
      <section>
        <h4>{action.name}</h4>
        <Description>{action.description ?? 'No description'}</Description>
      </section>
    </ActionContainer>
  )
}

const Detail: React.FC<DetailProps> = ({ actions, icon, title }) => {
  return (
    <ActionsContainer>
      <header>{title || 'What you can do? '}</header>
      {actions.map((action) => (
        <Action key={action?.actionId} action={action} icon={icon} />
      ))}
    </ActionsContainer>
  )
}

export default Detail
