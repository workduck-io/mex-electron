import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import icons from '@iconify/icons-ri/settings-4-line'
import { Margin, Title } from '../../../style/Integration'
import { PageContainer } from '../../../style/Layouts'
import { SettingsOptions, SettingsContent } from '../../../views/mex/Settings'
import { SettingsContainer } from '../Settings/styled'
import styled, { css } from 'styled-components'
import { actionsConfig } from './data'
import ActionStage from '../ActionStage'
import { transparentize } from 'polished'
import { mog } from '../../../utils/lib/helper'

const Action = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.default};
  gap: ${({ theme }) => theme.spacing.small};
  text-decoration: none;

  cursor: pointer;

  &:hover {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.colors.secondary};
  }

  ${({ active, theme }) =>
    active &&
    css`
  
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};
  svg {
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    `}
`

const SpotlightActions = () => {
  const [activeConfig, setActiveConfig] = useState(undefined)

  return (
    <PageContainer>
      <Title>Actions</Title>
      <SettingsContainer>
        <SettingsOptions>
          {Object.entries(actionsConfig).map(([id, config]) => {
            return (
              <Action
                active={activeConfig?.id === id}
                onClick={() => {
                  mog('CONFIG', config)
                  setActiveConfig(config)
                }}
                key={id}
              >
                <Icon icon={icons} />
                {config?.name}
              </Action>
            )
          })}
          <Margin />
        </SettingsOptions>
        <SettingsContent>
          <ActionStage id={activeConfig?.id} name={activeConfig?.name} />
        </SettingsContent>
      </SettingsContainer>
    </PageContainer>
  )
}

export default SpotlightActions
